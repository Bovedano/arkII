export interface EditorViewState {
  zoom: number;
  panX: number;
  panY: number;
  editingGroupId: string | null;
}

const STORAGE_PREFIX = 'super-t:editor-view:';

/** Persists per-level viewport state (zoom/pan) and which group was open for editing, keyed
 *  by level id, so reopening a level in the editor restores exactly where you left it instead
 *  of resetting zoom and dropping back out of the group being edited. */
export const EditorViewStore = {
  save(levelId: string, view: EditorViewState): void {
    localStorage.setItem(STORAGE_PREFIX + levelId, JSON.stringify(view));
  },

  load(levelId: string): EditorViewState | null {
    const raw = localStorage.getItem(STORAGE_PREFIX + levelId);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as EditorViewState;
    } catch {
      return null;
    }
  },
};
