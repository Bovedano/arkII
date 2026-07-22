import type { GameElementParams } from '../game-elements/core/types';

export interface LevelConfig {
  width: number;
  height: number;
  gravity: number;
  background: string; // CSS hex
}

export interface SublevelDef {
  /** Logical id used by unlock events and by GameState, e.g. "cueva_secreta". */
  id: string;
  /** The level id to load when this sublevel is selected, e.g. "level-01b". */
  level: string;
  /**
   * Which emitted event unlocks this sublevel, as "<elementId>:<eventName>",
   * e.g. "switch1:on" — matched against the string a GameElement emits on 'level-event'.
   */
  unlockOn: string;
}

export interface LevelElementDef<P extends GameElementParams = GameElementParams> {
  /** Optional; LevelLoader auto-generates `${type}-${index}` if omitted. */
  id?: string;
  /** Must match a type registered in GameElementRegistry. */
  type: string;
  x: number;
  y: number;
  params: P;
}

export interface LevelDefinition {
  id: string;
  title: string;
  config: LevelConfig;
  sublevels?: SublevelDef[];
  elements: LevelElementDef[];
}
