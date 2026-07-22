import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { GameScene } from './scenes/GameScene';
import { LevelEditorScene } from './scenes/LevelEditorScene';
// Side-effect import: registers every GameElement type before any level can be loaded.
import './game-elements/registerAll';

new Phaser.Game({
  ...gameConfig,
  scene: [BootScene, PreloadScene, MainMenuScene, LevelSelectScene, GameScene, LevelEditorScene],
});
