import type { LevelDefinition } from '../levels/types';

/** Serializes the editor's working level to JSON and offers copy/download — there's no
 *  backend to write files to, so exporting is the hand-off point: paste the result into a
 *  new src/levels/data/level-XX.ts as a `LEVEL_XX_TEXT` string export; levelRegistry.ts
 *  auto-discovers it via import.meta.glob, no manual registration needed. */
export class LevelExport {
  static toJSON(level: LevelDefinition): string {
    return JSON.stringify(level, null, 2);
  }

  static async copyToClipboard(level: LevelDefinition): Promise<void> {
    await navigator.clipboard.writeText(LevelExport.toJSON(level));
  }

  static download(level: LevelDefinition): void {
    const text = LevelExport.toJSON(level);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${level.id || 'level'}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
