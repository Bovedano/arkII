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

type EditorElement = GameElement & { visual: VisualLike; extraVisuals?: VisualLike[] };

interface HandlePair {
  tl: Phaser.GameObjects.Rectangle;
  br: Phaser.GameObjects.Rectangle;
}

interface GroupInstanceVisual {
  instanceIndex: number;
  childVisuals: VisualLike[];
  wrapper: Phaser.GameObjects.Rectangle;
  handles: HandlePair;
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

/** A plain (non-ctrl) drag on a corner handle translates the pointed-to item(s) instead of
 *  resizing — tracked as a plain pointer-delta applied to each item's start position(s).
 *  Elements and placed group instances share this one state shape: dragging a handle that
 *  belongs to an item inside an active multi-selection (shift-click) moves *every* selected
 *  item together as one rigid block, regardless of whether it's an element, a group instance,
 *  or a mix of both — so `elements`/`groups` are independent arrays, not a single-kind list.
 *  Positions are captured fresh at drag start (pointerdown), not read from render-time state —
 *  after a prior move, that would be stale and deltas computed against it would double-count
 *  the earlier move. */
interface MultiMoveState {
  /** Identifies the literal handle whose Phaser `drag`/`dragend` events drive this state —
   *  every other handle's listeners bail out when their own (kind, index) doesn't match. */
  primaryKind: 'element' | 'group';
  primaryIndex: number;
  handleStartX: number;
  handleStartY: number;
  elements: { index: number; startX: number; startY: number }[];
  groups: {
    index: number;
    startWrapperX: number;
    startWrapperY: number;
    startChildX: number[];
    startChildY: number[];
    /** The instance's own `level.groupInstances[index].x/y` at drag start — the wrapper's
     *  bounds don't coincide with this, so committing the move needs both: the wrapper's
     *  movement gives the delta, which is then applied to this starting instance position
     *  (mirrors the single-instance dragend logic this replaced). */
    startInstX: number;
    startInstY: number;
  }[];
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
  private multiMoveState: MultiMoveState | null = null;
  private groupInstanceVisuals: GroupInstanceVisual[] = [];
  private lastGroupClickAt: Map<number, number> = new Map();
  private multiSelectionBoxes: Phaser.GameObjects.Rectangle[] = [];
  private lastWidth: number | null = null;
  private lastHeight: number | null = null;
  private lastEditingGroupId: string | null | undefined = undefined;
  private isPanning = false;
  private lastPointerX = 0;
  private lastPointerY = 0;

  /** @param hasRestoredView - True when `state.zoom`/`panX`/`panY` were just restored from
   *  EditorViewStore, so the first render() must not clobber them with an auto-fit — see the
   *  width/height-change check in render(). */
  constructor(scene: Phaser.Scene, state: EditorState, rect: ViewportRect, hasRestoredView = false) {
    this.scene = scene;
    this.state = state;
    this.rect = rect;
    if (hasRestoredView) {
      this.lastWidth = state.level.config.width;
      this.lastHeight = state.level.config.height;
      this.lastEditingGroupId = state.editingGroupId;
    }

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
      if (this.tryEnterGroupEditAt(pointer)) return;
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

  /** Refits zoom/pan to frame the currently active content — the level bounds normally, or the
   *  open group's own elements while in group-edit mode — mirroring the auto-fit render() does
   *  the first time a level/group is opened (see the width/height-change check there). Exposed
   *  for a "Restaurar vista" button so a pan/zoom the user has lost track of (panned or zoomed
   *  far off the content) can always be recovered without leaving the editor. */
  resetView(): void {
    if (this.state.editingGroupId) {
      const elements = this.state.activeElements;
      const padding = 200;
      const fitWidth = Math.max(...elements.map((el) => el.x), 0) + padding;
      const fitHeight = Math.max(...elements.map((el) => el.y), 0) + padding;
      this.state.setZoom(Math.min(this.rect.width / fitWidth, this.rect.height / fitHeight, 1));
    } else {
      const { width, height } = this.state.level.config;
      this.state.setZoom(Math.min(this.rect.width / width, this.rect.height / height, 1));
    }
    this.state.setPan(0, 0);
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

  /** Manual hit test recovering "double click a group's body enters group-edit mode" without
   *  making the wrapper interactive (see createGroupInstanceVisual for why). Returns true —
   *  and enters edit mode — only on the second click of a pair landing inside the same group's
   *  bounds within DOUBLE_CLICK_MS; a lone first click just records itself and lets the caller
   *  fall through to panning, same as any other click on empty background. */
  private tryEnterGroupEditAt(pointer: Phaser.Input.Pointer): boolean {
    const { x, y } = this.screenToLevel(pointer.x, pointer.y);
    for (const giv of this.groupInstanceVisuals) {
      const bounds = this.localBounds(giv.wrapper);
      if (!Phaser.Geom.Rectangle.Contains(bounds, x, y)) continue;
      const now = this.scene.time.now;
      const lastClick = this.lastGroupClickAt.get(giv.instanceIndex) ?? 0;
      this.lastGroupClickAt.set(giv.instanceIndex, now);
      if (now - lastClick < DOUBLE_CLICK_MS) {
        const inst = this.state.level.groupInstances?.[giv.instanceIndex];
        if (inst) this.state.enterGroupEdit(inst.groupId);
        return true;
      }
      return false;
    }
    return false;
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
    this.multiMoveState = null;
    for (const giv of this.groupInstanceVisuals) {
      for (const visual of giv.childVisuals) (visual as unknown as Phaser.GameObjects.GameObject).destroy();
      giv.wrapper.destroy();
      giv.handles.tl.destroy();
      giv.handles.br.destroy();
    }
    this.groupInstanceVisuals = [];
    this.backgroundImage?.destroy();
    this.backgroundImage = undefined;

    const { width, height } = this.state.level.config;
    this.levelBounds.setSize(width, height);
    // A group's own elements use coordinates relative to its local origin, not the level's —
    // the level-bounds frame would mislead the user while editing one.
    this.levelBounds.setVisible(!this.state.editingGroupId);

    const editingGroupId = this.state.editingGroupId;
    const enteredOrExitedGroup = editingGroupId !== this.lastEditingGroupId;
    this.lastEditingGroupId = editingGroupId;

    if (editingGroupId) {
      // Entering a group swaps activeElements to its local-origin coordinates (see
      // EditorState.activeElements), which can sit far outside the level's pan/zoom framing —
      // fit the view to the group's own elements instead, or they'd render off-screen.
      if (enteredOrExitedGroup) {
        const elements = this.state.activeElements;
        const padding = 200;
        const fitWidth = Math.max(...elements.map((el) => el.x), 0) + padding;
        const fitHeight = Math.max(...elements.map((el) => el.y), 0) + padding;
        this.state.setZoom(Math.min(this.rect.width / fitWidth, this.rect.height / fitHeight, 1));
        this.state.setPan(0, 0);
      }
    } else if (width !== this.lastWidth || height !== this.lastHeight || enteredOrExitedGroup) {
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
        for (const extra of instance.extraVisuals ?? []) {
          extra.setVisible?.(true);
          extra.setAlpha?.(0.35);
        }
      }

      this.container.add(instance.visual);
      // A type may create secondary GameObjects beyond `visual` (e.g. GEFixedBackground's
      // mirrored repeat tiles) — those must join the same pan/zoom/mask container, or they'd
      // render in raw scene coordinates instead of the editor's level preview.
      for (const extra of instance.extraVisuals ?? []) this.container.add(extra as unknown as Phaser.GameObjects.GameObject);
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
    for (const giv of this.groupInstanceVisuals) {
      this.container.bringToTop(giv.handles.tl);
      this.container.bringToTop(giv.handles.br);
    }
    this.updateSelectionBox();

    this.scene.physics.world.pause();
  }

  /**
   * Builds one placed group instance: every child element (rendered read-only — no individual
   * interactivity, so Phaser's topmost-hit-test always resolves a click to the invisible
   * `wrapper` covering the whole group, never to a single child) plus that wrapper, which is
   * deliberately inert for selection and movement (same as a single element's body, see
   * render()) — it only catches a double click within DOUBLE_CLICK_MS to enter group-edit
   * mode. Selecting and moving the instance both happen exclusively through its corner
   * handles, same affordance as single elements, so a click or drag on the group's body never
   * selects or displaces it.
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
        for (const extra of instance.extraVisuals ?? []) {
          if (def.params.hidden) {
            extra.setVisible?.(true);
            extra.setAlpha?.(0.35);
          }
          this.container.add(extra as unknown as Phaser.GameObjects.GameObject);
          childVisuals.push(extra);
        }
      }
    }

    // Orphaned instance (its group was deleted, e.g. via hand-edited JSON) — render a small
    // fixed-size placeholder so it stays visible/selectable/deletable instead of vanishing
    // silently or crashing the render.
    const bounds =
      childVisuals.length > 0 ? this.unionLocalBounds(childVisuals) : new Phaser.Geom.Rectangle(inst.x, inst.y, 24, 24);

    // The wrapper (the group's body) is deliberately NOT interactive — same as a single
    // element's body, see render(). A left-drag starting anywhere over it must fall through to
    // the background and pan the viewport, exactly like a drag over a plain element; selecting
    // and moving the instance happen exclusively through its corner handles. Double-clicking
    // the body still enters group-edit mode, but that's recovered via a manual hit test in the
    // background's own pointerdown handler (see tryEnterGroupEditAt) rather than by making the
    // wrapper interactive, which would swallow the pan-drag gesture again.
    const wrapper = this.scene.add
      .rectangle(bounds.x, bounds.y, Math.max(bounds.width, 4), Math.max(bounds.height, 4), 0xff4a4a, resolved ? 0 : 0.25)
      .setOrigin(0, 0)
      .setStrokeStyle(resolved ? 0 : 2, 0xff4a4a);
    this.container.add(wrapper);

    const handles = this.createGroupHandlePair(instanceIndex, wrapper);

    return { instanceIndex, childVisuals, wrapper, handles };
  }

  /** Two small squares pinned to a placed group instance's bounding-box corners — mirrors
   *  createHandlePair for single elements. The only way to move a placed group instance;
   *  its body (the wrapper) is inert, see createGroupInstanceVisual. */
  private createGroupHandlePair(instanceIndex: number, wrapper: Phaser.GameObjects.Rectangle): HandlePair {
    const bounds = this.localBounds(wrapper);
    const style = (rect: Phaser.GameObjects.Rectangle) =>
      rect.setStrokeStyle(1, 0x000000).setDepth(10000).setInteractive({ useHandCursor: true });

    const tl = style(this.scene.add.rectangle(bounds.left, bounds.top, HANDLE_SIZE, HANDLE_SIZE, 0x9a4aff, 0.9));
    const br = style(this.scene.add.rectangle(bounds.right, bounds.bottom, HANDLE_SIZE, HANDLE_SIZE, 0x9a4aff, 0.9));
    this.container.add(tl);
    this.container.add(br);
    this.scene.input.setDraggable(tl);
    this.scene.input.setDraggable(br);

    this.wireGroupHandle(tl, instanceIndex);
    this.wireGroupHandle(br, instanceIndex);

    return { tl, br };
  }

  /** Captures drag-start state for a plain handle drag on `primaryKind`/`primaryIndex`. When
   *  that item is part of an active multi-selection (total selected across both kinds > 1),
   *  every selected element AND group instance is captured, so the whole mixed selection drags
   *  as one rigid block; otherwise just the single clicked item is captured. */
  private buildMultiMoveState(
    primaryKind: 'element' | 'group',
    primaryIndex: number,
    handle: Phaser.GameObjects.Rectangle,
  ): MultiMoveState {
    const totalSelected = this.state.multiSelected.size + this.state.multiSelectedGroupInstances.size;
    const isPartOfMultiSelection =
      totalSelected > 1 &&
      (primaryKind === 'element'
        ? this.state.multiSelected.has(primaryIndex)
        : this.state.multiSelectedGroupInstances.has(primaryIndex));

    const elementIndices = isPartOfMultiSelection
      ? [...this.state.multiSelected]
      : primaryKind === 'element'
        ? [primaryIndex]
        : [];
    const groupIndices = isPartOfMultiSelection
      ? [...this.state.multiSelectedGroupInstances]
      : primaryKind === 'group'
        ? [primaryIndex]
        : [];

    return {
      primaryKind,
      primaryIndex,
      handleStartX: handle.x,
      handleStartY: handle.y,
      elements: elementIndices.map((index) => {
        const inst = this.instances[index];
        return { index, startX: inst?.visual.x ?? 0, startY: inst?.visual.y ?? 0 };
      }),
      groups: groupIndices.map((index) => {
        const giv = this.groupInstanceVisuals[index];
        const inst = this.state.level.groupInstances?.[index];
        return {
          index,
          startWrapperX: giv?.wrapper.x ?? 0,
          startWrapperY: giv?.wrapper.y ?? 0,
          startChildX: giv?.childVisuals.map((v) => v.x) ?? [],
          startChildY: giv?.childVisuals.map((v) => v.y) ?? [],
          startInstX: inst?.x ?? 0,
          startInstY: inst?.y ?? 0,
        };
      }),
    };
  }

  /** Live drag preview: applies a pointer delta to every element/group-instance captured in
   *  `multiMoveState`, keeping the whole selection moving together as one rigid block. */
  private applyMultiMoveDelta(dx: number, dy: number): void {
    const move = this.multiMoveState;
    if (!move) return;
    for (const el of move.elements) {
      const inst = this.instances[el.index];
      if (!inst) continue;
      inst.visual.x = el.startX + dx;
      inst.visual.y = el.startY + dy;
      this.repositionHandles(el.index);
    }
    for (const g of move.groups) {
      const giv = this.groupInstanceVisuals[g.index];
      if (!giv) continue;
      for (let i = 0; i < giv.childVisuals.length; i++) {
        giv.childVisuals[i].x = g.startChildX[i] + dx;
        giv.childVisuals[i].y = g.startChildY[i] + dy;
      }
      giv.wrapper.setPosition(g.startWrapperX + dx, g.startWrapperY + dy);
      this.repositionGroupHandles(g.index);
    }
    this.updateSelectionBox();
  }

  /** Commits a finished multi-move into the level definition, as a single undo step covering
   *  every moved element and group instance (see EditorState.moveSelection). */
  private commitMultiMove(): void {
    const move = this.multiMoveState;
    this.multiMoveState = null;
    if (!move) return;

    const elementMoves = move.elements
      .map((el) => {
        const inst = this.instances[el.index];
        return inst ? { index: el.index, x: inst.visual.x, y: inst.visual.y } : null;
      })
      .filter((m): m is { index: number; x: number; y: number } => m !== null);

    const groupMoves = move.groups
      .map((g) => {
        const giv = this.groupInstanceVisuals[g.index];
        if (!giv) return null;
        const dx = giv.wrapper.x - g.startWrapperX;
        const dy = giv.wrapper.y - g.startWrapperY;
        return { index: g.index, x: g.startInstX + dx, y: g.startInstY + dy };
      })
      .filter((m): m is { index: number; x: number; y: number } => m !== null);

    if (elementMoves.length === 0 && groupMoves.length === 0) return;
    this.state.moveSelection(elementMoves, groupMoves);
  }

  private wireGroupHandle(handle: Phaser.GameObjects.Rectangle, instanceIndex: number): void {
    handle.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.leftButtonDown()) return;

      // Shift-click a handle toggles this instance into/out of the multi-selection (mirrors
      // the per-element handle below), so it can be dragged together with other selected
      // elements/instances, or fed into a future multi-kind action.
      if ((pointer.event as MouseEvent | undefined)?.shiftKey) {
        this.state.toggleSelectGroupInstance(instanceIndex);
        return;
      }

      // An instance already part of an active multi-selection keeps that selection intact (so
      // the drag below moves the whole group of items) — collapsing to a single selection only
      // happens when the clicked instance isn't part of one.
      const totalSelected = this.state.multiSelected.size + this.state.multiSelectedGroupInstances.size;
      const isPartOfMultiSelection = totalSelected > 1 && this.state.multiSelectedGroupInstances.has(instanceIndex);
      if (!isPartOfMultiSelection) this.state.selectGroupInstance(instanceIndex);

      this.multiMoveState = this.buildMultiMoveState('group', instanceIndex, handle);
    });
    // dragX/dragY are already in local (container) space, same convention as the per-element
    // drag handler above.
    handle.on('drag', (...args: unknown[]) => {
      const [pointer, dragX, dragY] = args as [Phaser.Input.Pointer, number, number];
      if (!pointer.leftButtonDown()) return;
      const move = this.multiMoveState;
      if (!move || move.primaryKind !== 'group' || move.primaryIndex !== instanceIndex) return;
      this.applyMultiMoveDelta(dragX - move.handleStartX, dragY - move.handleStartY);
    });
    handle.on('dragend', () => {
      const move = this.multiMoveState;
      if (!move || move.primaryKind !== 'group' || move.primaryIndex !== instanceIndex) return;
      this.commitMultiMove();
    });
  }

  /** Keeps a placed group instance's corner handles pinned to its wrapper bounds while it's
   *  repositioned — mirrors repositionHandles for single elements. */
  private repositionGroupHandles(instanceIndex: number): void {
    const giv = this.groupInstanceVisuals[instanceIndex];
    if (!giv) return;
    const bounds = this.localBounds(giv.wrapper);
    giv.handles.tl.setPosition(bounds.left, bounds.top);
    giv.handles.br.setPosition(bounds.right, bounds.bottom);
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

      // A handle whose element already sits inside an active multi-selection keeps that
      // selection intact (so the drag below moves the whole selection) — collapsing to a
      // single selection only happens when the clicked element isn't part of one.
      const totalSelected = this.state.multiSelected.size + this.state.multiSelectedGroupInstances.size;
      const isMultiSelected = totalSelected > 1 && this.state.multiSelected.has(index);
      if (!isMultiSelected) this.select(index);
      this.resizeState = null;
      this.multiMoveState = null;

      // A plain drag on a corner handle moves the element (the object's own body is inert —
      // see the render() loop). Ctrl+drag repurposes the handle as a resize instead.
      if (!(pointer.event as MouseEvent | undefined)?.ctrlKey) {
        this.multiMoveState = this.buildMultiMoveState('element', index, handle);
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

      const move = this.multiMoveState;
      if (move && move.primaryKind === 'element' && move.primaryIndex === index) {
        this.applyMultiMoveDelta(dragX - move.handleStartX, dragY - move.handleStartY);
        return;
      }

      if (!this.resizeState || this.resizeState.index !== index) return;
      handle.setPosition(dragX, dragY);
      this.resizeState.lastX = dragX;
      this.resizeState.lastY = dragY;
      this.previewResize();
    });
    handle.on('dragend', () => {
      const move = this.multiMoveState;
      if (move && move.primaryKind === 'element' && move.primaryIndex === index) {
        this.commitMultiMove();
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
    this.repositionGroupHandles(instanceIndex);
    this.updateSelectionBox();
  }

  /** Redraws whichever selection outline currently applies — a single element's bounds, a
   *  single placed group instance's bounding box, or a multi-selection pool covering any mix
   *  of selected elements (yellow) and group instances (purple) — always destroying/recreating
   *  the multi-select pool from scratch since it varies in count and is only touched on
   *  selection changes, never on a per-frame drag. */
  private updateSelectionBox(): void {
    for (const box of this.multiSelectionBoxes) box.destroy();
    this.multiSelectionBoxes = [];

    const totalSelected = this.state.multiSelected.size + this.state.multiSelectedGroupInstances.size;
    if (totalSelected > 1) {
      this.selectionBox.setVisible(false);
      const addBox = (bounds: Phaser.Geom.Rectangle, color: number) => {
        const box = this.scene.add
          .rectangle(bounds.left, bounds.top, bounds.width, bounds.height, 0x000000, 0)
          .setOrigin(0, 0)
          .setStrokeStyle(2, color);
        this.container.add(box);
        this.container.bringToTop(box);
        this.multiSelectionBoxes.push(box);
      };
      for (const idx of this.state.multiSelected) {
        const instance = this.instances[idx];
        if (instance) addBox(this.localBounds(instance.visual), 0xffd24a);
      }
      for (const idx of this.state.multiSelectedGroupInstances) {
        const giv = this.groupInstanceVisuals[idx];
        if (giv) addBox(this.localBounds(giv.wrapper), 0x9a4aff);
      }
      return;
    }

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
