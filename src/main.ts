import Phaser from 'phaser';
import { appConfig } from './config/appConfig';
import { gameConfig } from './config/gameConfig';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { GameScene } from './scenes/GameScene';
import { LevelEditorScene } from './scenes/LevelEditorScene';
import './ui/menu.css';
import './ui/hud.css';
import './ui/touch-controls.css';
// Side-effect import: registers every GameElement type before any level can be loaded.
import './game-elements/registerAll';

document.title = appConfig.name;

new Phaser.Game({
  ...gameConfig,
  scene: [BootScene, PreloadScene, MainMenuScene, LevelSelectScene, GameScene, LevelEditorScene],
});
