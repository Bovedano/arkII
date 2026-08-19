import Phaser from 'phaser';
import { appConfig } from './appConfig';

// Also the coordinate space FixedBackground elements are placed in (see
// GEFixedBackground — it pins itself to the camera via scrollFactor(0,0), so its x/y are
// screen pixels in this range rather than level/world coordinates).
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true,
  backgroundColor: '#1d1d2b',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 600 },
      // Draws every Arcade body's actual collision rect (size + offset already applied),
      // which is exactly "element borders accounting for offsets". This is just the
      // initial state when dev mode is on; GameScene binds F9 to toggle it at runtime.
      debug: appConfig.dev,
    },
  },

  scene: [],
};
