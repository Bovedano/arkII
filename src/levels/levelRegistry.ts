import { LEVEL_01_TEXT } from './data/level-01';
import { LEVEL_01B_TEXT } from './data/level-01b';

export interface LevelMeta {
  id: string;
  title: string;
  /** Plain-text (JSON) level definition — hardcoded today, a DB column tomorrow. */
  text: string;
}

export const LEVEL_REGISTRY: LevelMeta[] = [
  { id: 'level-01', title: 'Nivel 1', text: LEVEL_01_TEXT },
  { id: 'level-01b', title: 'Cueva Secreta', text: LEVEL_01B_TEXT },
];

export function getLevelText(id: string): string {
  const meta = LEVEL_REGISTRY.find((l) => l.id === id);
  if (!meta) throw new Error(`Unknown level id "${id}"`);
  return meta.text;
}
