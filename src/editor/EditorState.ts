import { GameElementRegistry } from '../game-elements/core/registry';
import type { GameElementParams } from '../game-elements/core/types';
import type { LevelDefinition, LevelElementDef, SublevelDef } from '../levels/types';

export type EditorChangeListener = () => void;

/** In-memory editable copy of a LevelDefinition — the level editor's single source of truth. */
export class EditorState {
  level: LevelDefinition;
  selectedIndex: number | null = null;
  private listeners: EditorChangeListener[] = [];

  constructor(level: LevelDefinition) {
    this.level = level;
  }

  static blank(id: string): EditorState {
    const level: LevelDefinition = {
      id,
      title: 'Nuevo nivel',
      config: { width: 960, height: 540, gravity: 600, background: '#4a7fc9' },
      sublevels: [],
      elements: [
        {
          type: 'ColorBlock',
          x: 0,
          y: 500,
          params: { width: 960, height: 40, color: '#4a3728', zIndex: 0, behavior: 'solid' },
        },
        { type: 'Penista', x: 100, y: 400, params: { zIndex: 10, behavior: 'solid' } },
      ],
    };
    return new EditorState(level);
  }

  onChange(listener: EditorChangeListener): void {
    this.listeners.push(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }

  addElement(type: string, x: number, y: number): number {
    const meta = GameElementRegistry.getMeta(type);
    const def: LevelElementDef = {
      id: `${type}-${Date.now().toString(36)}`,
      type,
      x,
      y,
      params: { ...meta.defaultParams } as GameElementParams,
    };
    this.level.elements.push(def);
    this.selectedIndex = this.level.elements.length - 1;
    this.notify();
    return this.selectedIndex;
  }

  moveElement(index: number, x: number, y: number): void {
    const def = this.level.elements[index];
    if (!def) return;
    def.x = x;
    def.y = y;
    this.notify();
  }

  updateElementParam(index: number, key: string, value: unknown): void {
    const def = this.level.elements[index];
    if (!def) return;
    def.params[key] = value;
    this.notify();
  }

  removeElement(index: number): void {
    this.level.elements.splice(index, 1);
    if (this.selectedIndex === index) this.selectedIndex = null;
    this.notify();
  }

  select(index: number | null): void {
    this.selectedIndex = index;
    this.notify();
  }

  setLevelConfig(partial: Partial<LevelDefinition['config']>): void {
    Object.assign(this.level.config, partial);
    this.notify();
  }

  setLevelMeta(partial: { id?: string; title?: string }): void {
    Object.assign(this.level, partial);
    this.notify();
  }

  addSublevel(def: SublevelDef): void {
    if (!this.level.sublevels) this.level.sublevels = [];
    this.level.sublevels.push(def);
    this.notify();
  }

  removeSublevel(index: number): void {
    this.level.sublevels?.splice(index, 1);
    this.notify();
  }

  /** Moves the level's single Penista to (x, y), creating one if the level has none yet. */
  setPlayerStart(x: number, y: number): void {
    const existingIndex = this.level.elements.findIndex((el) => el.type === 'Penista');
    if (existingIndex === -1) {
      this.addElement('Penista', x, y);
    } else {
      this.moveElement(existingIndex, x, y);
    }
  }
}
