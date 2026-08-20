import type { GameElementParams } from '../game-elements/core/types';

export interface LevelCameraConfig {
  /** Id of the element the camera should follow. Omitted = the level's main character (Penista). */
  follow?: string;
  /** Deadzone width/height (px) the followed target can move within before the camera scrolls.
   *  Omitted or 0 = camera stays centered on the target, matching the previous hardcoded behavior. */
  marginX?: number;
  marginY?: number;
}

export interface LevelBackgroundImageConfig {
  /** Filename of an image registered in BACKGROUND_ASSETS (src/config/backgroundAssets.ts),
   *  matching a file in public/assets/backgrounds. */
  image: string;
  /** Horizontal parallax as a percentage of camera scroll (0-100). 0 = fixed to the screen
   *  (reads as far away), 100 = scrolls at the same rate as everything else (no depth effect).
   *  Omitted = 100. */
  parallaxX?: number;
  /** Same as parallaxX, vertical. Omitted = 100. */
  parallaxY?: number;
}

export interface LevelConfig {
  width: number;
  height: number;
  gravity: number;
  background: string; // CSS hex, shown behind/around the background image (or alone if none)
  /** Optional decorative image layer, scrolling at a percentage of the camera to fake depth. */
  backgroundImage?: LevelBackgroundImageConfig;
  /** Level time limit in seconds. Omitted = 300 (5 min), see GameSession. */
  timeLimitSec?: number;
  camera?: LevelCameraConfig;
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

export interface GroupDef {
  id: string;
  name: string;
  /** Relative to the group's own local origin (0,0), not level-absolute. */
  elements: LevelElementDef[];
}

export interface GroupInstanceDef {
  id: string;
  groupId: string;
  x: number;
  y: number;
}

export interface LevelDefinition {
  id: string;
  title: string;
  /** Marks the level as dev-only: it's hidden from the level select menu unless appConfig.dev is true. */
  dev?: boolean;
  config: LevelConfig;
  sublevels?: SublevelDef[];
  elements: LevelElementDef[];
  groups?: GroupDef[];
  groupInstances?: GroupInstanceDef[];
}
