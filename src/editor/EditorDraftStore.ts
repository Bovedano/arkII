import type { LevelDefinition } from '../levels/types';

const STORAGE_KEY = 'super-t:editor-draft';

/** Persists the level currently being edited so it survives reloads/navigation, and so
 *  "Probar nivel" can round-trip through the real GameScene without losing in-progress edits. */
export const EditorDraftStore = {
  save(level: LevelDefinition): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(level));
  },

  load(): LevelDefinition | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LevelDefinition;
    } catch {
      return null;
    }
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
