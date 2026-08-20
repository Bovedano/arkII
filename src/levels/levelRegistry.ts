import type { LevelDefinition } from './types';

export interface LevelMeta {
  id: string;
  title: string;
  /** Dev-only levels are hidden from the level select menu unless appConfig.dev is true. */
  dev: boolean;
  /** Plain-text (JSON) level definition — hardcoded today, a DB column tomorrow. */
  text: string;
}

// Auto-descubre cada archivo en ./data — añadir un nivel nuevo no requiere tocar este
// archivo, solo crear src/levels/data/level-XX.ts. Eager (no lazy) porque los niveles son
// JSON pequeño como texto, no assets pesados que valga la pena trocear en chunks.
const modules = import.meta.glob<Record<string, string>>('./data/*.ts', { eager: true });

export const LEVEL_REGISTRY: LevelMeta[] = Object.entries(modules).map(([path, mod]) => {
  const text = Object.values(mod)[0];
  if (typeof text !== 'string') {
    throw new Error(`El archivo de nivel "${path}" debe exportar exactamente una constante string.`);
  }
  const parsed = JSON.parse(text) as LevelDefinition;
  return { id: parsed.id, title: parsed.title, dev: parsed.dev ?? false, text };
});

export function getLevelText(id: string): string {
  const meta = LEVEL_REGISTRY.find((l) => l.id === id);
  if (!meta) throw new Error(`Unknown level id "${id}"`);
  return meta.text;
}
