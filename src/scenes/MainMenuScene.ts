import Phaser from 'phaser';
import { appConfig } from '../config/appConfig';
import { DomOverlay } from '../editor/DomOverlay';
import { renderMenuOption, wireMenuActions } from '../ui/domMenu';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create(): void {
    const overlay = new DomOverlay(this, {});
    overlay.root.className = 'menu-overlay';

    const options = [renderMenuOption({ action: 'play', label: 'Jugar' })];
    if (appConfig.dev) {
      options.push(renderMenuOption({ action: 'editor', label: 'Editor de Niveles' }));
    }

    overlay.root.innerHTML = `
      <div class="menu-title">${appConfig.name}</div>
      <div class="menu-list">${options.join('')}</div>
    `;

    wireMenuActions(overlay.root, {
      play: () => this.scene.start('LevelSelect'),
      editor: () => this.scene.start('LevelEditor'),
    });
  }
}
