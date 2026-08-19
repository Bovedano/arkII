import Phaser from 'phaser';
import { GameElementRegistry } from '../game-elements/core/registry';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig';
import type { EditorState } from './EditorState';
import type { EditorCanvas } from './EditorCanvas';

export interface PaletteRect {
  x: number;
  y: number;
  width: number;
}

interface ScrollEntry {
  obj: Phaser.GameObjects.Text;
  baseY: number;
}

const ITEM_HEIGHT = 30;
const SCROLL_SPEED = 0.5;

/**
 * Left-side palette: one draggable label per GameElementRegistry.list() entry, plus a
 * reactive second section listing the level's reusable groups (src/levels/types.ts
 * GroupDef). Dragging a label spawns a ghost that follows the pointer; dropping it over the
 * canvas viewport adds a new element/group instance at the drop position.
 *
 * The combined list can exceed the visible canvas height (many registered types + many
 * groups), so the whole column is clipped to a geometry mask and scrolls on mouse wheel —
 * there's no DOM scrollbar here since this lives on the Phaser canvas, not #editor-sidebar.
 */
export class EditorPalette {
  private groupLabels: Phaser.GameObjects.Text[] = [];
  private typesBottomY: number;

  private readonly mask: Phaser.Display.Masks.GeometryMask;
  private readonly maskShape: Phaser.GameObjects.Graphics;
  private readonly viewportTop: number;
  private readonly viewportHeight: number;
  private readonly staticEntries: ScrollEntry[] = [];
  private groupEntries: ScrollEntry[] = [];
  private contentHeight = 0;
  private scrollOffset = 0;

  constructor(
    private scene: Phaser.Scene,
    private state: EditorState,
    private canvas: EditorCanvas,
    private rect: PaletteRect,
  ) {
    this.viewportTop = rect.y;
    this.viewportHeight = scene.cameras.main.height - rect.y - 10;

    this.maskShape = scene.make.graphics({}, false);
    this.maskShape.fillStyle(0xffffff);
    this.maskShape.fillRect(rect.x - 4, this.viewportTop, rect.width + 20, this.viewportHeight);
    this.mask = this.maskShape.createGeometryMask();

    const heading = scene.add.text(rect.x, rect.y, 'Elementos', { fontSize: '14px', color: '#ffffff' });
    heading.setMask(this.mask);
    this.staticEntries.push({ obj: heading, baseY: rect.y });

    let y = rect.y + 26;
    for (const { type, meta } of GameElementRegistry.list()) {
      const label = this.makeDraggableLabel(type, y, (levelX, levelY) => {
        // fixedToCamera types (e.g. FixedBackground) ignore scrollFactor and read their x/y
        // as screen pixels, not level/world coordinates — dropping them at the world position
        // under the cursor would bake in a coordinate far outside the visible canvas, so start
        // them centered on screen instead. The property panel documents the valid range.
        if (meta.fixedToCamera) {
          state.addElement(type, GAME_WIDTH / 2, GAME_HEIGHT / 2);
        } else {
          state.addElement(type, Math.round(levelX), Math.round(levelY));
        }
      });
      label.setMask(this.mask);
      this.staticEntries.push({ obj: label, baseY: y });
      y += ITEM_HEIGHT;
    }
    this.typesBottomY = y;

    this.renderGroups();
    state.onChange(() => this.renderGroups());

    scene.input.on('wheel', this.onWheel, this);
    scene.events.once('shutdown', () => {
      scene.input.off('wheel', this.onWheel, this);
      this.maskShape.destroy();
    });
  }

  /** Rebuilds the "Grupos" section — groups are created/renamed/deleted at runtime (unlike
   *  the static registered-type list above), so this redraws on every structural change.
   *  Hidden while editing a group: dragging a group into itself/another group isn't supported. */
  private renderGroups(): void {
    for (const label of this.groupLabels) label.destroy();
    this.groupLabels = [];
    this.groupEntries = [];

    const groups = this.state.level.groups ?? [];
    if (this.state.editingGroupId || groups.length === 0) {
      this.contentHeight = this.typesBottomY - this.rect.y;
      this.repositionAll();
      return;
    }

    let y = this.typesBottomY + 10;
    const heading = this.scene.add.text(this.rect.x, y, 'Grupos', { fontSize: '14px', color: '#ffffff' });
    heading.setMask(this.mask);
    this.groupLabels.push(heading);
    this.groupEntries.push({ obj: heading, baseY: y });
    y += 26;

    for (const group of groups) {
      const label = this.makeDraggableLabel(group.name, y, (levelX, levelY) => {
        this.state.addGroupInstance(group.id, Math.round(levelX), Math.round(levelY));
      });
      label.setMask(this.mask);
      this.groupLabels.push(label);
      this.groupEntries.push({ obj: label, baseY: y });
      y += ITEM_HEIGHT;
    }

    this.contentHeight = y - this.rect.y;
    this.repositionAll();
  }

  private onWheel = (pointer: Phaser.Input.Pointer, _over: unknown, _dx: number, deltaY: number): void => {
    if (pointer.x < this.rect.x - 4 || pointer.x > this.rect.x + this.rect.width + 16) return;
    if (pointer.y < this.viewportTop || pointer.y > this.viewportTop + this.viewportHeight) return;
    this.scrollOffset += deltaY * SCROLL_SPEED;
    this.repositionAll();
  };

  /** Applies `scrollOffset` (clamped to content bounds) to every tracked label, and disables
   *  input on labels scrolled outside the mask so an invisible label can't still be dragged. */
  private repositionAll(): void {
    const maxScroll = Math.max(0, this.contentHeight - this.viewportHeight);
    this.scrollOffset = Phaser.Math.Clamp(this.scrollOffset, 0, maxScroll);

    for (const entry of [...this.staticEntries, ...this.groupEntries]) {
      const newY = entry.baseY - this.scrollOffset;
      entry.obj.setY(newY);
      if (entry.obj.input) {
        const visible =
          newY + ITEM_HEIGHT / 2 >= this.viewportTop && newY - ITEM_HEIGHT / 2 <= this.viewportTop + this.viewportHeight;
        entry.obj.input.enabled = visible;
      }
    }
  }

  private makeDraggableLabel(text: string, y: number, onDrop: (levelX: number, levelY: number) => void): Phaser.GameObjects.Text {
    const { scene, canvas, rect } = this;
    const label = scene.add
      .text(rect.x, y, text, {
        fontSize: '14px',
        color: '#cccccc',
        backgroundColor: '#2a2a3a',
        padding: { x: 6, y: 4 },
      })
      .setInteractive({ useHandCursor: true });
    scene.input.setDraggable(label);

    let ghost: Phaser.GameObjects.Text | null = null;
    label.on('dragstart', () => {
      ghost = scene.add.text(label.x, label.y, text, { fontSize: '14px', color: '#ffd24a' }).setDepth(1000);
    });
    label.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      ghost?.setPosition(dragX, dragY);
    });
    label.on('dragend', (pointer: Phaser.Input.Pointer) => {
      ghost?.destroy();
      ghost = null;
      if (canvas.containsScreenPoint(pointer.x, pointer.y)) {
        const { x: levelX, y: levelY } = canvas.screenToLevel(pointer.x, pointer.y);
        onDrop(levelX, levelY);
      }
    });

    return label;
  }
}
