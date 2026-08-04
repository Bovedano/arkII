import Phaser from 'phaser';
import { GameElementRegistry } from '../game-elements/core/registry';
import type { GameElement } from '../game-elements/core/GameElement';
import { resolveGroupInstance } from '../levels/groupInstance';
import type { GroupInstanceDef } from '../levels/types';
import type { EditorState } from './EditorState';

export interface ViewportRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

type VisualLike = Phaser.GameObjects.GameObject & {
  x: number;
  y: number;
  width?: number;
  height?: number;
  displayWidth?: number;
  displayHeight?: number;
  originX?: number;
  originY?: number;
  setInteractive: (config?: unknown) => VisualLike;
  setVisible?: (v: boolean) => unknown;
  setAlpha?: (a: number) => unknown;
  on: (event: string, handler: (...args: unknown[]) => void) => unknown;
};

type EditorElement = GameElement & { visual: VisualLike };

interface HandlePair {
  tl: Phaser.GameObjects.Rectangle;
  br: Phaser.GameObjects.Rectangle;
}

interface GroupInstanceVisual {
  instanceIndex: number;
  childVisuals: VisualLike[];
  wrapper: Phaser.GameObjects.Rectangle;
}

/** Gates a group-instance wrapper's `drag`/`dragend` handlers to the instance currently being
 *  dragged — mirrors HandleMoveState/ResizeState's role for the resize handles. Positions are
 *  captured fresh at drag start (pointerdown), not read from the wrapper-creation closure —
 *  after a prior move, that closure's bounds/child positions are stale, so deltas computed
 *  against them would double-count the earlier move. */
interface GroupDragState {
  instanceIndex: number;
  startWrapperX: number;
  startWrapperY: number;
  startChildX: number[];
  startChildY: number[];
}

const DOUBLE_CLICK_MS = 300;

interface ResizeState {
  index: number;
  anchorX: number;
  anchorY: number;
  /** Where def.x/def.y sit within the bounds box, as a 0..1 fraction — derived once at drag
   *  start from the visual's actual origin, so the anchor corner stays visually fixed
   *  regardless of whether the element's origin is top-left (blocks), center (sprites), etc. */
  originXFrac: number;
  originYFrac: number;
  lastX: number;
  lastY: number;
}

/** A plain (non-ctrl) drag on a corner handle translates the element instead of resizing it —
 *  tracked as a plain pointer-delta applied to the visual's start position. */
interface HandleMoveState {
  index: number;
  handleStartX: number;
  handleStartY: number;
  visualStartX: number;
  visualStartY: number;
}

const HANDLE_SIZE = 14;

/**
 * Renders the level being edited inside a fixed screen viewport, reusing the same
 * GameElementRegistry.create()+init() path GameScene/LevelLoader use for real gameplay,
 * so the editor always looks exactly like the game. Physics stays enabled (so bodies match
 * `behavior`) but paused, so nothing simulates while editing.
 */
export class EditorCanvas {
  private scene: Phaser.Scene;
  private state: EditorState;
  private rect: ViewportRect;
  private container: Phaser.GameObjects.Container;
  private levelBounds: Phaser.GameObjects.Rectangle;
  private selectionBox: Phaser.GameObjects.Rectangle;
  private background: Phaser.GameObjects.Rectangle;
  private backgroundImage?: Phaser.GameObjects.Image;
  private instances: EditorElement[] = [];
  private handles: HandlePair[] = [];
  private resizeState: ResizeState | null = null;
  private handleMoveState: HandleMoveState | null = null;
  private groupInstanceVisuals: GroupInstanceVisual[] = [];
  private groupDragState: GroupDragState | null = null;
  private lastGroupClickAt: Map<number, number> = new Map();
  private multiSelectionBoxes: Phaser.GameObjects.Rectangle[] = [];
  private lastWidth: number | null = null;
  private lastHeight: number | null = null;
  private isPanning = false;
  private lastPointerX = 0;
  private lastPointerY = 0;

  constructor(scene: Phaser.Scene, state: EditorState, rect: ViewportRect) {
    this.scene = scene;
    this.state = state;
    this.rect = rect;

    this.background = scene.add
      .rectangle(rect.x, rect.y, rect.width, rect.height, 0x000000, 0)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x555555)
      .setInteractive();

    this.container = scene.add.container(rect.x, rect.y);
    // Content can extend past the fixed preview box once zoom/pan are in play — clip it.
    const maskShape = scene.make.graphics({}).fillStyle(0xffffff).fillRect(rect.x, rect.y, rect.width, rect.height);
    this.container.setMask(maskShape.createGeometryMask());

    // Marks the level's actual width/height (level.config), in level space at (0,0) — panning
    // and zooming are otherwise unbounded, so without this the level edges are invisible and
    // it looks like the canvas scrolls forever.
    this.levelBounds = scene.add
      .rectangle(0, 0, 10, 10, 0x000000, 0)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x4ac9ff);
    this.container.add(this.levelBounds);

    this.selectionBox = scene.add
      .rectangle(0, 0, 10, 10, 0x000000, 0)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0xffd24a)
      .setVisible(false);
    this.container.add(this.selectionBox);

    // Plain pointer tracking (not Phaser's drag-on-object) so the frame rectangle itself
    // never moves — only the container's pan offset changes.
    // Left-drag on empty background pans (convenience for sparse levels); right-drag pans
    // from anywhere inside the viewport, including on top of elements — with a busy/large
    // level there's often no empty spot left to grab, so left-drag alone isn't enough.
    this.background.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.leftButtonDown()) return;
      this.startPan(pointer);
    });
    scene.input.mouse?.disableContextMenu();
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.rightButtonDown()) return;
      if (!this.containsScreenPoint(pointer.x, pointer.y)) return;
      this.startPan(pointer);
    });
    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.isPanning) return;
      this.state.panBy(pointer.x - this.lastPointerX, pointer.y - this.lastPointerY);
      this.lastPointerX = pointer.x;
      this.lastPointerY = pointer.y;
    });
    scene.input.on('pointerup', () => (this.isPanning = false));

    // Mouse wheel also pans (shift+wheel for horizontal, like most editors/IDEs) — the
    // right-drag above requires a held button, which isn't discoverable and doesn't work
    // with trackpads, so wheel scrolling is the primary way most users expect to navigate
    // a zoomed-in canvas.
    scene.input.on(
      'wheel',
      (pointer: Phaser.Input.Pointer, _over: unknown, deltaX: number, deltaY: number) => {
        if (!this.containsScreenPoint(pointer.x, pointer.y)) return;
        if (deltaX !== 0) {
          this.state.panBy(-deltaX, 0);
        } else {
          this.state.panBy(0, -deltaY);
        }
      },
    );

    state.onChange(() => this.render());
    // Selection/move must NOT rebuild the canvas — a rebuild fired from inside the
    // pointerdown that starts a drag would destroy the very GameObject Phaser is mid-gesture
    // with, silently breaking dragging.
    state.onSelectionChange(() => this.updateSelectionBox());
    state.onMove((index, x, y) => this.applyMove(index, x, y));
    state.onGroupInstanceMove((index, x, y) => this.applyGroupInstanceMove(index, x, y));
    state.onViewChange(() => this.applyView());
    this.render();
  }

  /** Converts a screen-space point (e.g. pointer.x/y) into level-space coordinates. */
  screenToLevel(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX - this.rect.x - this.state.panX) / this.state.zoom,
      y: (screenY - this.rect.y - this.state.panY) / this.state.zoom,
    };
  }

  /**
   * An element's bounds in *local* (container/level) space, matching the plain x/y coordinates
   * `def.x`/`def.y` and `instance.visual.x`/`y` already use. Deliberately NOT
   * `GameObject.getBounds()` — that method transforms through the object's parent chain
   * (`parentContainer.getBoundsTransformMatrix()`), so for anything inside `this.container`
   * (which itself is panned/zoomed) it returns scene/world-space coordinates. Feeding those
   * into another child of the same container — the selection box, the corner handles —
   * double-applies the container's pan/zoom and visibly offsets them from the real element.
   */
  private localBounds(visual: VisualLike): Phaser.Geom.Rectangle {
    const w = visual.displayWidth ?? visual.width ?? 32;
    const h = visual.displayHeight ?? visual.height ?? 32;
    const originX = visual.originX ?? 0;
    const originY = visual.originY ?? 0;
    return new Phaser.Geom.Rectangle(visual.x - originX * w, visual.y - originY * h, w, h);
  }

  /** Bounding box (local space) covering every visual in a placed group instance — used to
   *  size/position its click/drag wrapper. */
  private unionLocalBounds(visuals: VisualLike[]): Phaser.Geom.Rectangle {
    return visuals
      .map((v) => this.localBounds(v))
      .reduce((acc, b) => Phaser.Geom.Rectangle.Union(acc, b, new Phaser.Geom.Rectangle()));
  }

  containsScreenPoint(x: number, y: number): boolean {
    return (
      x >= this.rect.x && x <= this.rect.x + this.rect.width && y >= this.rect.y && y <= this.rect.y + this.rect.height
    );
  }

  private startPan(pointer: Phaser.Input.Pointer): void {
    this.isPanning = true;
    this.lastPointerX = pointer.x;
    this.lastPointerY = pointer.y;
  }

  private applyView(): void {
    this.container.setScale(this.state.zoom);
    this.container.setPosition(this.rect.x + this.state.panX, this.rect.y + this.state.panY);
  }

  private render(): void {
    for (const instance of this.instances) instance.destroy();
    this.instances = [];
    for (const handle of this.handles) {
      handle.tl.destroy();
      handle.br.destroy();
    }
    this.handles = [];
    this.resizeState = null;
    this.handleMoveState = null;
    this.groupDragState = null;
    for (const giv of this.groupInstanceVisuals) {
      for (const visual of giv.childVisuals) (visual as unknown as Phaser.GameObjects.GameObject).destroy();
      giv.wrapper.destroy();
    }
    this.groupInstanceVisuals = [];
    this.backgroundImage?.destroy();
    this.backgroundImage = undefined;

    const { width, height } = this.state.level.config;
    this.levelBounds.setSize(width, height);
    // A group's own elements use coordinates relative to its local origin, not the level's —
    // the level-bounds frame would mislead the user while editing one.
    this.levelBounds.setVisible(!this.state.editingGroupId);
    if (width !== this.lastWidth || height !== this.lastHeight) {
      this.lastWidth = width;
      this.lastHeight = height;
      this.state.setZoom(Math.min(this.rect.width / width, this.rect.height / height, 1));
      this.state.setPan(0, 0);
    }
    this.applyView();

    // Static preview only (no camera scroll inside the mini viewport) — sized to the level
    // bounds and ignoring parallax, just enough to show which image is picked.
    const bg = this.state.level.config.backgroundImage;
    if (bg?.image && this.scene.textures.exists(bg.image)) {
      this.backgroundImage = this.scene.add
        .image(width / 2, height / 2, bg.image)
        .setDisplaySize(width, height)
        .setDepth(-1000);
      this.container.add(this.backgroundImage);
    }

    this.state.activeElements.forEach((def, index) => {
      const instance = GameElementRegistry.create(def.type, {
        scene: this.scene,
        id: def.id ?? `${def.type}-${index}`,
        x: def.x,
        y: def.y,
        params: def.params,
      }) as unknown as EditorElement;
      instance.init();

      // Editor-only affordance: show hidden elements faintly so they stay selectable/movable —
      // the exported JSON still carries the real `hidden` param for actual gameplay.
      if (def.params.hidden) {
        instance.visual.setVisible?.(true);
        instance.visual.setAlpha?.(0.35);
      }

      this.container.add(instance.visual);
      this.instances.push(instance);

      // Deliberately not interactive/draggable — an element's body is inert. Selecting and
      // moving both happen exclusively through its corner handles (see wireHandle), so a
      // plain click-drag on the object itself never selects or moves it.

      this.handles.push(this.createHandlePair(index, instance));
    });

    // Placed group instances are never shown while editing another group — no nesting.
    if (!this.state.editingGroupId) {
      (this.state.level.groupInstances ?? []).forEach((inst, instanceIndex) => {
        this.groupInstanceVisuals.push(this.createGroupInstanceVisual(inst, instanceIndex));
      });
    }

    this.container.sort('depth');
    this.container.bringToTop(this.selectionBox);
    for (const handle of this.handles) {
      this.container.bringToTop(handle.tl);
      this.container.bringToTop(handle.br);
    }
    this.updateSelectionBox();

    this.scene.physics.world.pause();
  }

  /**
   * Builds one placed group instance: every child element (rendered read-only — no individual
   * interactivity, so Phaser's topmost-hit-test always resolves a click to the invisible
   * `wrapper` covering the whole group, never to a single child) plus that wrapper, which
   * carries all of the instance's interaction: single click selects the whole instance, a
   * second click within DOUBLE_CLICK_MS enters group-edit mode, and dragging moves every
   * child together by the same delta.
   */
  private createGroupInstanceVisual(inst: GroupInstanceDef, instanceIndex: number): GroupInstanceVisual {
    const resolved = resolveGroupInstance(this.state.level, inst);

    const childVisuals: VisualLike[] = [];
    if (resolved) {
      for (const { id, def } of resolved) {
        const instance = GameElementRegistry.create(def.type, {
          scene: this.scene,
          id,
          x: def.x,
          y: def.y,
          params: def.params,
        }) as unknown as EditorElement;
        instance.init();
        if (def.params.hidden) {
          instance.visual.setVisible?.(true);
          instance.visual.setAlpha?.(0.35);
        }
        this.container.add(instance.visual);
        childVisuals.push(instance.visual);
      }
    }

    // Orphaned instance (its group was deleted, e.g. via hand-edited JSON) — render a small
    // fixed-size placeholder so it stays visible/selectable/deletable instead of vanishing
    // silently or crashing the render.
    const bounds =
      childVisuals.length > 0 ? this.unionLocalBounds(childVisuals) : new Phaser.Geom.Rectangle(inst.x, inst.y, 24, 24);

    const wrapper = this.scene.add
      .rectangle(bounds.x, bounds.y, Math.max(bounds.width, 4), Math.max(bounds.height, 4), 0xff4a4a, resolved ? 0 : 0.25)
      .setOrigin(0, 0)
      .setStrokeStyle(resolved ? 0 : 2, 0xff4a4a)
      .setInteractive({ useHandCursor: true });
    this.container.add(wrapper);
    this.scene.input.setDraggable(wrapper);

    wrapper.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.leftButtonDown()) return;
      const now = this.scene.time.now;
      const lastClick = this.lastGroupClickAt.get(instanceIndex) ?? 0;
      this.lastGroupClickAt.set(instanceIndex, now);
      if (now - lastClick < DOUBLE_CLICK_MS) {
        this.state.enterGroupEdit(inst.groupId);
        return;
      }
      this.state.selectGroupInstance(instanceIndex);
      const giv = this.groupInstanceVisuals[instanceIndex];
      this.groupDragState = {
        instanceIndex,
        startWrapperX: wrapper.x,
        startWrapperY: wrapper.y,
        startChildX: giv ? giv.childVisuals.map((v) => v.x) : [],
        startChildY: giv ? giv.childVisuals.map((v) => v.y) : [],
      };
    });
    // dragX/dragY are already in local (container) space, same convention as the per-element
    // drag handler above — applying the wrapper's own delta (measured from drag-start, not
    // from the possibly-stale render-time bounds) to every child keeps them moving together
    // as one rigid block.
    wrapper.on('drag', (...args: unknown[]) => {
      const [pointer, dragX, dragY] = args as [Phaser.Input.Pointer, number, number];
      if (!pointer.leftButtonDown()) return;
      const drag = this.groupDragState;
      if (!drag || drag.instanceIndex !== instanceIndex) return;
      const dx = dragX - drag.startWrapperX;
      const dy = dragY - drag.startWrapperY;
      const giv = this.groupInstanceVisuals[instanceIndex];
      if (giv) {
        for (let i = 0; i < giv.childVisuals.length; i++) {
          giv.childVisuals[i].x = drag.startChildX[i] + dx;
          giv.childVisuals[i].y = drag.startChildY[i] + dy;
        }
      }
      wrapper.setPosition(dragX, dragY);
      this.updateSelectionBox();
    });
    wrapper.on('dragend', () => {
      const drag = this.groupDragState;
      if (!drag || drag.instanceIndex !== instanceIndex) return;
      const dx = wrapper.x - drag.startWrapperX;
      const dy = wrapper.y - drag.startWrapperY;
      this.state.moveGroupInstance(instanceIndex, inst.x + dx, inst.y + dy);
      this.groupDragState = null;
    });

    return { instanceIndex, childVisuals, wrapper };
  }

  private select(index: number): void {
    this.state.select(index);
  }

  /**
   * Two small squares pinned to an element's top-left/bottom-right corners — the *only* way
   * to select, move, or resize an element (the object's own body is inert, see the render()
   * loop). They exist on every element (not just the selected one) so an object fully hidden
   * underneath another — where a plain click can never reach it, since Phaser's input plugin
   * only hit-tests the topmost object at a point — is still reachable: its corners stick out
   * often enough to click directly. Clicking one both selects the element and immediately
   * arms it for a corner-drag move; ctrl+clicking arms a resize instead; shift-clicking one
   * toggles it into the multi-selection (see wireHandle).
   */
  private createHandlePair(index: number, instance: EditorElement): HandlePair {
    const bounds = this.localBounds(instance.visual);
    const style = (rect: Phaser.GameObjects.Rectangle) =>
      rect.setStrokeStyle(1, 0x000000).setDepth(10000).setInteractive({ useHandCursor: true });

    const tl = style(this.scene.add.rectangle(bounds.left, bounds.top, HANDLE_SIZE, HANDLE_SIZE, 0xffd24a, 0.9));
    const br = style(this.scene.add.rectangle(bounds.right, bounds.bottom, HANDLE_SIZE, HANDLE_SIZE, 0xffd24a, 0.9));
    this.container.add(tl);
    this.container.add(br);
    this.scene.input.setDraggable(tl);
    this.scene.input.setDraggable(br);

    this.wireHandle(tl, 'tl', index, instance);
    this.wireHandle(br, 'br', index, instance);

    return { tl, br };
  }

  private wireHandle(
    handle: Phaser.GameObjects.Rectangle,
    corner: 'tl' | 'br',
    index: number,
    instance: EditorElement,
  ): void {
    handle.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.leftButtonDown()) return;

      // Shift-click a handle toggles multi-selection (for "create group from selection")
      // instead of arming a resize/move — a shift-held drag on a handle isn't a gesture
      // anyone expects to resize or move the element.
      if ((pointer.event as MouseEvent | undefined)?.shiftKey) {
        this.state.toggleSelect(index);
        return;
      }

      this.select(index);
      this.resizeState = null;
      this.handleMoveState = null;

      // A plain drag on a corner handle moves the element (the object's own body is inert —
      // see the render() loop). Ctrl+drag repurposes the handle as a resize instead.
      if (!(pointer.event as MouseEvent | undefined)?.ctrlKey) {
        this.handleMoveState = {
          index,
          handleStartX: handle.x,
          handleStartY: handle.y,
          visualStartX: instance.visual.x,
          visualStartY: instance.visual.y,
        };
        return;
      }

      const bounds = this.localBounds(instance.visual);
      if (bounds.width === 0 || bounds.height === 0) return;
      const anchor =
        corner === 'tl' ? { x: bounds.right, y: bounds.bottom } : { x: bounds.left, y: bounds.top };
      const startX = corner === 'tl' ? bounds.left : bounds.right;
      const startY = corner === 'tl' ? bounds.top : bounds.bottom;
      this.resizeState = {
        index,
        anchorX: anchor.x,
        anchorY: anchor.y,
        originXFrac: (instance.visual.x - bounds.left) / bounds.width,
        originYFrac: (instance.visual.y - bounds.top) / bounds.height,
        lastX: startX,
        lastY: startY,
      };
    });
    handle.on('drag', (...args: unknown[]) => {
      const [pointer, dragX, dragY] = args as [Phaser.Input.Pointer, number, number];
      if (!pointer.leftButtonDown()) return;

      if (this.handleMoveState && this.handleMoveState.index === index) {
        const move = this.handleMoveState;
        instance.visual.x = move.visualStartX + (dragX - move.handleStartX);
        instance.visual.y = move.visualStartY + (dragY - move.handleStartY);
        this.updateSelectionBox();
        this.repositionHandles(index);
        return;
      }

      if (!this.resizeState || this.resizeState.index !== index) return;
      handle.setPosition(dragX, dragY);
      this.resizeState.lastX = dragX;
      this.resizeState.lastY = dragY;
      this.previewResize();
    });
    handle.on('dragend', () => {
      if (this.handleMoveState && this.handleMoveState.index === index) {
        this.state.moveElement(index, instance.visual.x, instance.visual.y);
        this.handleMoveState = null;
        return;
      }
      if (!this.resizeState || this.resizeState.index !== index) return;
      this.commitResize();
      this.resizeState = null;
    });
  }

  /** Live preview while a corner handle is being dragged: only the selection box outline
   *  moves — the real GameObject is left alone until dragend, when a fresh one gets built
   *  at the final size (see commitResize). */
  private previewResize(): void {
    if (!this.resizeState) return;
    const { anchorX, anchorY, lastX, lastY } = this.resizeState;
    this.selectionBox.setPosition(Math.min(anchorX, lastX), Math.min(anchorY, lastY));
    this.selectionBox.setSize(Math.abs(lastX - anchorX), Math.abs(lastY - anchorY));
    this.selectionBox.setVisible(true);
  }

  /** Commits a finished corner-drag into the level definition. Only element types that
   *  expose `width`+`height` (blocks) or `scale` (sprites) in their paramSchema can actually
   *  be resized this way — other types (e.g. the player) just snap their handles back. */
  private commitResize(): void {
    if (!this.resizeState) return;
    const { index, anchorX, anchorY, originXFrac, originYFrac, lastX, lastY } = this.resizeState;
    const def = this.state.activeElements[index];
    const instance = this.instances[index];
    if (!def || !instance) {
      this.updateSelectionBox();
      return;
    }

    const width = Math.max(4, Math.abs(lastX - anchorX));
    const height = Math.max(4, Math.abs(lastY - anchorY));
    const left = Math.min(anchorX, lastX);
    const top = Math.min(anchorY, lastY);

    const schemaKeys = new Set(GameElementRegistry.getMeta(def.type).paramSchema.map((f) => f.key));
    const paramUpdates: Record<string, unknown> = {};
    if (schemaKeys.has('width') && schemaKeys.has('height')) {
      paramUpdates.width = Math.round(width);
      paramUpdates.height = Math.round(height);
    } else if (schemaKeys.has('scale')) {
      const startBounds = this.localBounds(instance.visual);
      if (startBounds.width > 0 && startBounds.height > 0) {
        const currentScale = typeof def.params.scale === 'number' ? def.params.scale : 1;
        const factor = Math.max(width / startBounds.width, height / startBounds.height);
        paramUpdates.scale = Math.max(0.05, currentScale * factor);
      }
    } else {
      this.updateSelectionBox(); // this type has no resizable param — snap the box back
      return;
    }

    this.state.resizeElement(index, left + originXFrac * width, top + originYFrac * height, paramUpdates);
  }

  private applyMove(index: number, x: number, y: number): void {
    const instance = this.instances[index];
    if (!instance) return;
    instance.visual.x = x;
    instance.visual.y = y;
    this.updateSelectionBox();
    this.repositionHandles(index);
  }

  /** Keeps an element's corner handles pinned to its bounds while it's repositioned outside
   *  of a resize gesture (body drag, or an X/Y edit in the property panel). */
  private repositionHandles(index: number): void {
    const instance = this.instances[index];
    const handle = this.handles[index];
    if (!instance || !handle) return;
    const bounds = this.localBounds(instance.visual);
    handle.tl.setPosition(bounds.left, bounds.top);
    handle.br.setPosition(bounds.right, bounds.bottom);
  }

  /** Repositions a placed group instance's wrapper + children after a non-drag position
   *  change (e.g. an X/Y edit in the property panel) — mirrors applyMove for single elements.
   *  By the time this fires, `state.moveGroupInstance` has already written the new x/y into
   *  `level.groupInstances[instanceIndex]`, so re-resolving it directly yields each child's
   *  new absolute position — no delta math needed. */
  private applyGroupInstanceMove(instanceIndex: number, x: number, y: number): void {
    const giv = this.groupInstanceVisuals[instanceIndex];
    const inst = this.state.level.groupInstances?.[instanceIndex];
    if (!giv || !inst) return;
    const resolved = resolveGroupInstance(this.state.level, inst);
    if (resolved) {
      for (let i = 0; i < giv.childVisuals.length; i++) {
        giv.childVisuals[i].x = resolved[i].def.x;
        giv.childVisuals[i].y = resolved[i].def.y;
      }
      const bounds = this.unionLocalBounds(giv.childVisuals);
      giv.wrapper.setPosition(bounds.x, bounds.y);
    } else {
      giv.wrapper.setPosition(x, y); // orphaned placeholder: the wrapper *is* the instance
    }
    this.updateSelectionBox();
  }

  /** Redraws whichever selection outline currently applies — a single element's bounds, a
   *  set of multi-selected elements' bounds (feeding "create group from selection"), or a
   *  placed group instance's bounding box — always destroying/recreating the multi-select
   *  pool from scratch since it varies in count and is only touched on selection changes,
   *  never on a per-frame drag. */
  private updateSelectionBox(): void {
    for (const box of this.multiSelectionBoxes) box.destroy();
    this.multiSelectionBoxes = [];

    const groupIndex = this.state.selectedGroupInstanceIndex;
    if (groupIndex !== null) {
      const giv = this.groupInstanceVisuals[groupIndex];
      if (!giv) {
        this.selectionBox.setVisible(false);
        return;
      }
      const bounds = this.localBounds(giv.wrapper);
      this.selectionBox.setStrokeStyle(2, 0x9a4aff);
      this.selectionBox.setPosition(bounds.left, bounds.top);
      this.selectionBox.setSize(bounds.width, bounds.height);
      this.selectionBox.setVisible(true);
      return;
    }

    if (this.state.multiSelected.size > 1) {
      this.selectionBox.setVisible(false);
      for (const idx of this.state.multiSelected) {
        const instance = this.instances[idx];
        if (!instance) continue;
        const bounds = this.localBounds(instance.visual);
        const box = this.scene.add
          .rectangle(bounds.left, bounds.top, bounds.width, bounds.height, 0x000000, 0)
          .setOrigin(0, 0)
          .setStrokeStyle(2, 0xffd24a);
        this.container.add(box);
        this.container.bringToTop(box);
        this.multiSelectionBoxes.push(box);
      }
      return;
    }

    this.selectionBox.setStrokeStyle(2, 0xffd24a);
    const index = this.state.selectedIndex;
    const instance = index !== null ? this.instances[index] : undefined;
    if (index === null || !instance) {
      this.selectionBox.setVisible(false);
      return;
    }
    const bounds = this.localBounds(instance.visual);
    this.selectionBox.setPosition(bounds.left, bounds.top);
    this.selectionBox.setSize(bounds.width, bounds.height);
    this.selectionBox.setVisible(true);
  }
}
