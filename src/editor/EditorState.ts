import { GameElementRegistry } from '../game-elements/core/registry';
import type { GameElementParams } from '../game-elements/core/types';
import type {
  LevelBackgroundImageConfig,
  LevelCameraConfig,
  LevelDefinition,
  LevelElementDef,
  SublevelDef,
} from '../levels/types';

export type EditorChangeListener = () => void;
export type EditorMoveListener = (index: number, x: number, y: number) => void;
export type GroupDeleteResult = 'blocked' | 'deleted';

/** In-memory editable copy of a LevelDefinition — the level editor's single source of truth.
 *
 * Change notifications are split into three channels on purpose:
 * - `onChange`: structural changes (add/remove/param edits, level config/meta, sublevels) —
 *   these need the canvas to fully destroy+recreate its GameElements.
 * - `onSelectionChange`: selection only. Must NOT trigger a canvas rebuild — a rebuild fired
 *   from inside the pointerdown that starts a drag destroys the very GameObject Phaser is
 *   mid-gesture with, silently breaking dragging.
 * - `onMove`: position updates (drag or manual X/Y edit) — just repositions the existing
 *   visual, no rebuild.
 */
export class EditorState {
  level: LevelDefinition;
  selectedIndex: number | null = null;
  /** Id of the group currently open for editing, or null when editing the top-level level.
   *  Drives `activeElements` below. Editor-only — never part of the exported LevelDefinition;
   *  persisted separately per level by EditorViewStore so reopening the editor resumes group
   *  editing instead of always landing back at the top level. */
  editingGroupId: string | null = null;
  selectedGroupInstanceIndex: number | null = null;
  /** Elements multi-selected (shift-click) — feeds "create group from selection" and, together
   *  with `multiSelectedGroupInstances`, lets a drag on any selected item's handle move the
   *  whole mixed selection as one block. Superset containing `selectedIndex` when the selection
   *  is exactly one element and no group instances are selected. */
  multiSelected: Set<number> = new Set();
  /** Placed group instances multi-selected (shift-click) — the group-instance counterpart to
   *  `multiSelected`. Superset containing `selectedGroupInstanceIndex` when the selection is
   *  exactly one group instance and no elements are selected. Elements and group instances can
   *  be selected together (e.g. shift-clicking an element then a group instance): both sets are
   *  non-empty and `selectedIndex`/`selectedGroupInstanceIndex` are both null, since neither
   *  alone describes the whole selection — see syncSingleSelection. */
  multiSelectedGroupInstances: Set<number> = new Set();
  /** Editor-only viewport state (zoom/pan) — never part of the exported LevelDefinition, but
   *  persisted separately per level by EditorViewStore (see LevelEditorScene). */
  zoom = 1;
  panX = 0;
  panY = 0;
  private listeners: EditorChangeListener[] = [];
  private selectionListeners: EditorChangeListener[] = [];
  private moveListeners: EditorMoveListener[] = [];
  private groupInstanceMoveListeners: EditorMoveListener[] = [];
  private viewListeners: EditorChangeListener[] = [];

  /** Undo/redo history — snapshots of `level` only (selection/zoom/pan are editor-only and
   *  intentionally excluded, see class doc above). Capped to bound memory on long sessions. */
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private inHistoryTransaction = false;
  private static readonly MAX_HISTORY = 100;

  constructor(level: LevelDefinition) {
    this.level = level;
  }

  static blank(id: string): EditorState {
    const level: LevelDefinition = {
      id,
      title: 'Nuevo nivel',
      config: { width: 1200, height: 540, gravity: 600, background: '#4a7fc9' },
      sublevels: [],
      groups: [],
      groupInstances: [],
      elements: [
        {
          type: 'ColorBlock',
          x: 0,
          y: 500,
          params: { width: 1200, height: 40, color: '#4a3728', zIndex: 0, behavior: 'solid' },
        },
        { type: 'Penista', x: 100, y: 400, params: { zIndex: 10, behavior: 'solid' } },
      ],
    };
    return new EditorState(level);
  }

  /** Where element-CRUD currently operates: level.elements normally, or the definition of the
   *  group currently open in group-edit mode. Live reference, not a copy — this is what makes
   *  editing a group propagate to every placement, with no separate "commit" step. */
  get activeElements(): LevelElementDef[] {
    const group = this.editingGroupId ? this.level.groups?.find((g) => g.id === this.editingGroupId) : undefined;
    return group ? group.elements : this.level.elements;
  }

  onChange(listener: EditorChangeListener): void {
    this.listeners.push(listener);
  }

  onSelectionChange(listener: EditorChangeListener): void {
    this.selectionListeners.push(listener);
  }

  onMove(listener: EditorMoveListener): void {
    this.moveListeners.push(listener);
  }

  /** Position updates for a whole placed group instance (drag-the-wrapper) — separate from
   *  onMove since it indexes into level.groupInstances, not activeElements. */
  onGroupInstanceMove(listener: EditorMoveListener): void {
    this.groupInstanceMoveListeners.push(listener);
  }

  /** View state (zoom/pan) only. Must NOT trigger a canvas rebuild — see onSelectionChange. */
  onViewChange(listener: EditorChangeListener): void {
    this.viewListeners.push(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }

  private notifySelection(): void {
    for (const listener of this.selectionListeners) listener();
  }

  private notifyMove(index: number, x: number, y: number): void {
    for (const listener of this.moveListeners) listener(index, x, y);
  }

  private notifyGroupInstanceMove(index: number, x: number, y: number): void {
    for (const listener of this.groupInstanceMoveListeners) listener(index, x, y);
  }

  private notifyView(): void {
    for (const listener of this.viewListeners) listener();
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /** Wraps a data-mutating method: snapshots `level` before the change (once per outermost
   *  call — nested mutators, e.g. createGroupFromSelection calling addGroupInstance, share the
   *  same snapshot so the whole compound action undoes atomically) and clears the redo stack. */
  private withHistory<T>(fn: () => T): T {
    const isOutermost = !this.inHistoryTransaction;
    if (isOutermost) {
      this.inHistoryTransaction = true;
      this.undoStack.push(JSON.stringify(this.level));
      if (this.undoStack.length > EditorState.MAX_HISTORY) this.undoStack.shift();
      this.redoStack = [];
    }
    try {
      return fn();
    } finally {
      if (isOutermost) this.inHistoryTransaction = false;
    }
  }

  undo(): void {
    if (this.undoStack.length === 0) return;
    const snapshot = this.undoStack.pop()!;
    this.redoStack.push(JSON.stringify(this.level));
    this.level = JSON.parse(snapshot) as LevelDefinition;
    this.selectedIndex = null;
    this.multiSelected = new Set();
    this.selectedGroupInstanceIndex = null;
    this.multiSelectedGroupInstances = new Set();
    this.notify();
  }

  redo(): void {
    if (this.redoStack.length === 0) return;
    const snapshot = this.redoStack.pop()!;
    this.undoStack.push(JSON.stringify(this.level));
    this.level = JSON.parse(snapshot) as LevelDefinition;
    this.selectedIndex = null;
    this.multiSelected = new Set();
    this.selectedGroupInstanceIndex = null;
    this.multiSelectedGroupInstances = new Set();
    this.notify();
  }

  setZoom(zoom: number): void {
    this.zoom = zoom;
    this.notifyView();
  }

  setPan(x: number, y: number): void {
    this.panX = x;
    this.panY = y;
    this.notifyView();
  }

  panBy(dx: number, dy: number): void {
    this.setPan(this.panX + dx, this.panY + dy);
  }

  addElement(type: string, x: number, y: number): number {
    return this.withHistory(() => {
      const meta = GameElementRegistry.getMeta(type);
      const def: LevelElementDef = {
        id: `${type}-${Date.now().toString(36)}`,
        type,
        x,
        y,
        params: { ...meta.defaultParams } as GameElementParams,
      };
      this.activeElements.push(def);
      this.selectedIndex = this.activeElements.length - 1;
      this.notify();
      return this.selectedIndex;
    });
  }

  moveElement(index: number, x: number, y: number): void {
    const def = this.activeElements[index];
    if (!def) return;
    this.withHistory(() => {
      def.x = x;
      def.y = y;
      this.notifyMove(index, x, y);
    });
  }

  /** Commits a drag that moved a whole selection together as one rigid block — any mix of
   *  elements and placed group instances (dragging a handle that belongs to an active
   *  multi-selection moves everything selected, regardless of kind) — as a single undo step
   *  instead of one entry per item. */
  moveSelection(
    elementMoves: { index: number; x: number; y: number }[],
    groupInstanceMoves: { index: number; x: number; y: number }[],
  ): void {
    this.withHistory(() => {
      for (const { index, x, y } of elementMoves) {
        const def = this.activeElements[index];
        if (!def) continue;
        def.x = x;
        def.y = y;
        this.notifyMove(index, x, y);
      }
      for (const { index, x, y } of groupInstanceMoves) {
        const inst = this.level.groupInstances?.[index];
        if (!inst) continue;
        inst.x = x;
        inst.y = y;
        this.notifyGroupInstanceMove(index, x, y);
      }
    });
  }

  updateElementParam(index: number, key: string, value: unknown): void {
    const def = this.activeElements[index];
    if (!def) return;
    this.withHistory(() => {
      def.params[key] = value;
      this.notify();
    });
  }

  /** Position + size/scale params in one shot (corner-drag resize) — a single `notify()`
   *  instead of a separate moveElement()+updateElementParam() so a resize only rebuilds
   *  the canvas once instead of twice. */
  resizeElement(index: number, x: number, y: number, paramUpdates: Record<string, unknown>): void {
    const def = this.activeElements[index];
    if (!def) return;
    this.withHistory(() => {
      def.x = x;
      def.y = y;
      Object.assign(def.params, paramUpdates);
      this.notify();
    });
  }

  /** Clones the element at `index` with identical params, placed just to its right (offset by
   *  its `width` param when present, else a flat fallback), and selects the new copy. */
  duplicateElement(index: number): number {
    return this.withHistory(() => {
      const source = this.activeElements[index];
      if (!source) return index;
      const offsetX = typeof source.params.width === 'number' ? source.params.width : 40;
      const copy: LevelElementDef = {
        ...source,
        id: `${source.type}-${Date.now().toString(36)}`,
        x: source.x + offsetX,
        params: { ...source.params },
      };
      this.activeElements.splice(index + 1, 0, copy);
      this.selectedIndex = index + 1;
      this.multiSelected = new Set([this.selectedIndex]);
      this.notify();
      return this.selectedIndex;
    });
  }

  removeElement(index: number): void {
    this.withHistory(() => {
      this.activeElements.splice(index, 1);
      if (this.selectedIndex === index) this.selectedIndex = null;
      this.notify();
    });
  }

  /** Plain (non-shift) click on an element: replaces the *whole* selection — elements and
   *  group instances alike — with just this element. */
  select(index: number | null): void {
    this.selectedIndex = index;
    this.multiSelected = index !== null ? new Set([index]) : new Set();
    this.selectedGroupInstanceIndex = null;
    this.multiSelectedGroupInstances = new Set();
    this.notifySelection();
  }

  /** Plain (non-shift) click on a placed group instance: replaces the whole selection with
   *  just this instance — the group-instance counterpart to `select`. */
  selectGroupInstance(index: number | null): void {
    this.selectedGroupInstanceIndex = index;
    this.multiSelectedGroupInstances = index !== null ? new Set([index]) : new Set();
    this.selectedIndex = null;
    this.multiSelected = new Set();
    this.notifySelection();
  }

  /** After `multiSelected`/`multiSelectedGroupInstances` change, recomputes the "exactly one
   *  item selected" pointers (`selectedIndex`/`selectedGroupInstanceIndex`) so the
   *  single-selection property panel keeps working when a multi-selection collapses to one
   *  item — of either kind. Both pointers are null whenever the selection is empty, mixed
   *  across kinds, or has more than one item of the same kind. */
  private syncSingleSelection(): void {
    const soleElement = this.multiSelected.size === 1 && this.multiSelectedGroupInstances.size === 0;
    const soleGroupInstance = this.multiSelectedGroupInstances.size === 1 && this.multiSelected.size === 0;
    this.selectedIndex = soleElement ? [...this.multiSelected][0] : null;
    this.selectedGroupInstanceIndex = soleGroupInstance ? [...this.multiSelectedGroupInstances][0] : null;
  }

  /** Shift-click on an element's handle: adds/removes it from the multi-selection — used both
   *  to build a group and, together with `multiSelectedGroupInstances`, to drag the whole
   *  selection as one block (see EditorCanvas). Never clears the group-instance side of the
   *  selection, so shift-clicking elements and group instances together builds one mixed
   *  selection. */
  toggleSelect(index: number): void {
    if (this.multiSelected.has(index)) this.multiSelected.delete(index);
    else this.multiSelected.add(index);
    this.syncSingleSelection();
    this.notifySelection();
  }

  /** Shift-click on a placed group instance's handle — the group-instance counterpart to
   *  `toggleSelect`. */
  toggleSelectGroupInstance(index: number): void {
    if (this.multiSelectedGroupInstances.has(index)) this.multiSelectedGroupInstances.delete(index);
    else this.multiSelectedGroupInstances.add(index);
    this.syncSingleSelection();
    this.notifySelection();
  }

  /** Bulk-replaces the whole selection with an explicit set of elements and group instances —
   *  used by RangeSelectPanel to select everything falling inside a dragged X/Y slider window.
   *  Like the other selection methods, this is editor-only state and doesn't touch undo
   *  history. */
  selectRange(elementIndices: number[], groupInstanceIndices: number[]): void {
    this.multiSelected = new Set(elementIndices);
    this.multiSelectedGroupInstances = new Set(groupInstanceIndices);
    this.syncSingleSelection();
    this.notifySelection();
  }

  setLevelConfig(partial: Partial<LevelDefinition['config']>): void {
    this.withHistory(() => {
      Object.assign(this.level.config, partial);
      this.notify();
    });
  }

  setLevelMeta(partial: { id?: string; title?: string; dev?: boolean }): void {
    this.withHistory(() => {
      Object.assign(this.level, partial);
      this.notify();
    });
  }

  /** Merges into `level.config.camera` (rather than replacing it) so editing one field
   *  — e.g. marginX — doesn't drop the others, like `follow`. */
  setCameraConfig(partial: Partial<LevelCameraConfig>): void {
    this.withHistory(() => {
      this.level.config.camera = { ...this.level.config.camera, ...partial };
      this.notify();
    });
  }

  /** Merges into `level.config.backgroundImage`. Clearing `image` (empty string) drops the
   *  whole config instead of leaving a dangling parallax setting with nothing to apply it to. */
  setBackgroundImageConfig(partial: Partial<LevelBackgroundImageConfig>): void {
    this.withHistory(() => {
      const merged = { ...this.level.config.backgroundImage, ...partial };
      this.level.config.backgroundImage = merged.image ? (merged as LevelBackgroundImageConfig) : undefined;
      this.notify();
    });
  }

  addSublevel(def: SublevelDef): void {
    this.withHistory(() => {
      if (!this.level.sublevels) this.level.sublevels = [];
      this.level.sublevels.push(def);
      this.notify();
    });
  }

  removeSublevel(index: number): void {
    this.withHistory(() => {
      this.level.sublevels?.splice(index, 1);
      this.notify();
    });
  }

  addGroupInstance(groupId: string, x: number, y: number): number {
    if (this.editingGroupId) return -1; // no nesting groups inside groups
    return this.withHistory(() => {
      if (!this.level.groupInstances) this.level.groupInstances = [];
      const id = `${groupId}-inst-${Date.now().toString(36)}`;
      this.level.groupInstances.push({ id, groupId, x, y });
      const index = this.level.groupInstances.length - 1;
      this.notify();
      this.selectGroupInstance(index);
      return index;
    });
  }

  moveGroupInstance(index: number, x: number, y: number): void {
    const inst = this.level.groupInstances?.[index];
    if (!inst) return;
    this.withHistory(() => {
      inst.x = x;
      inst.y = y;
      this.notifyGroupInstanceMove(index, x, y);
    });
  }

  removeGroupInstance(index: number): void {
    this.withHistory(() => {
      this.level.groupInstances?.splice(index, 1);
      if (this.selectedGroupInstanceIndex === index) this.selectedGroupInstanceIndex = null;
      this.notify();
    });
  }

  /** Extracts the ≥2 elements in `multiSelected` into a new shared GroupDef (coordinates
   *  relative to their bounding-box top-left), replaces them in-place with a single
   *  GroupInstanceDef at that origin, and selects the new instance. Returns null and does
   *  nothing if fewer than 2 elements are selected — a "group" of 1 is pure indirection with
   *  no reuse benefit. */
  createGroupFromSelection(name: string): string | null {
    const indices = [...this.multiSelected].sort((a, b) => a - b);
    if (indices.length < 2) return null;

    return this.withHistory(() => {
      const defs = indices.map((i) => this.activeElements[i]);
      const minX = Math.min(...defs.map((d) => d.x));
      const minY = Math.min(...defs.map((d) => d.y));
      const groupId = `group-${Date.now().toString(36)}`;
      const groupElements: LevelElementDef[] = defs.map((d) => ({
        ...(JSON.parse(JSON.stringify(d)) as LevelElementDef),
        x: d.x - minX,
        y: d.y - minY,
      }));
      if (!this.level.groups) this.level.groups = [];
      this.level.groups.push({ id: groupId, name, elements: groupElements });

      for (const i of [...indices].sort((a, b) => b - a)) this.activeElements.splice(i, 1);

      this.addGroupInstance(groupId, minX, minY);
      return groupId;
    });
  }

  renameGroup(groupId: string, name: string): void {
    const group = this.level.groups?.find((g) => g.id === groupId);
    if (!group) return;
    this.withHistory(() => {
      group.name = name;
      this.notify();
    });
  }

  /** Refuses (returns 'blocked', changes nothing) when the group has ≥1 placed instance and
   *  cascade wasn't requested, so the caller (GroupPanel) can surface a confirmation step. */
  deleteGroup(groupId: string, opts?: { cascade?: boolean }): GroupDeleteResult {
    const inUse = (this.level.groupInstances ?? []).some((gi) => gi.groupId === groupId);
    if (inUse && !opts?.cascade) return 'blocked';
    return this.withHistory(() => {
      this.level.groupInstances = (this.level.groupInstances ?? []).filter((gi) => gi.groupId !== groupId);
      this.level.groups = (this.level.groups ?? []).filter((g) => g.id !== groupId);
      if (this.editingGroupId === groupId) this.editingGroupId = null;
      // The filter above renumbers every remaining group instance, invalidating any index-based
      // selection of them regardless of whether the deleted group was itself selected.
      this.selectedGroupInstanceIndex = null;
      this.multiSelectedGroupInstances = new Set();
      this.notify();
      return 'deleted' as GroupDeleteResult;
    });
  }

  enterGroupEdit(groupId: string): void {
    if (!this.level.groups?.some((g) => g.id === groupId)) return;
    this.editingGroupId = groupId;
    this.select(null);
    this.notify();
  }

  exitGroupEdit(): void {
    this.editingGroupId = null;
    this.select(null);
    this.notify();
  }

  /** Moves the level's single Penista to (x, y), creating one if the level has none yet.
   *  No-op while editing a group — otherwise this would write a spawn point into the shared
   *  group definition, cloning it into every placement of that group. */
  setPlayerStart(x: number, y: number): void {
    if (this.editingGroupId) return;
    const existingIndex = this.level.elements.findIndex((el) => el.type === 'Penista');
    if (existingIndex === -1) {
      this.addElement('Penista', x, y);
    } else {
      this.moveElement(existingIndex, x, y);
    }
  }
}
