import Phaser from 'phaser';
import { appConfig } from './appConfig';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 960,
  height: 540,
  pixelArt: true,
  backgroundColor: '#1d1d2b',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 540,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 600 },
      // Draws every Arcade body's actual collision rect (size + offset already applied),
      // which is exactly "element borders accounting for offsets" — tied to dev mode
      // instead of a hand-toggled flag.
      debug: appConfig.dev,
    },
  },

  // Enables `scene.add.dom(...)` — used by the level editor's property/config panels.
  dom: {
    createContainer: true,
  },

  scene: [],
};
