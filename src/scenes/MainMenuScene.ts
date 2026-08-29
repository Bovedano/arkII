import Phaser from 'phaser';
import { appConfig } from '../config/appConfig';
import { DomOverlay } from '../editor/DomOverlay';
import { renderMenuOption, wireMenuActions } from '../ui/domMenu';
import { mountFullscreenButton } from '../ui/fullscreenButton';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create(): void {
    const overlay = new DomOverlay(this, {});
    overlay.root.className = 'menu-overlay title-screen';

    const options = [renderMenuOption({ action: 'play', label: 'Jugar' })];
    if (appConfig.dev) {
      options.push(renderMenuOption({ action: 'editor', label: 'Editor de Niveles' }));
    }

    overlay.root.innerHTML = `
      <div class="title-scene-bg" aria-hidden="true"></div>
      <div class="title-scanlines" aria-hidden="true"></div>
      <div class="title-content">
        <div class="menu-title title-logo">${appConfig.name}</div>
        <div class="title-tagline">the game</div>
        <div class="menu-list">${options.join('')}</div>
      </div>
    `;

    wireMenuActions(overlay.root, {
      play: () => this.scene.start('LevelSelect'),
      editor: () => this.scene.start('LevelEditor'),
    });

    mountFullscreenButton(overlay.root);
  }
}
