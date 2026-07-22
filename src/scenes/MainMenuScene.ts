import Phaser from 'phaser';
import { appConfig } from '../config/appConfig';

interface MenuOption {
  label: string;
  onSelect: () => void;
}

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create(): void {
    this.add.text(480, 100, 'Super T', { fontSize: '36px', color: '#ffffff' }).setOrigin(0.5, 0);

    const options: MenuOption[] = [{ label: 'Jugar', onSelect: () => this.scene.start('LevelSelect') }];
    if (appConfig.dev) {
      options.push({ label: 'Editor de Niveles', onSelect: () => this.scene.start('LevelEditor') });
    }

    let y = 220;
    for (const option of options) {
      const text = this.add
        .text(480, y, option.label, { fontSize: '24px', color: '#ffffff' })
        .setOrigin(0.5, 0)
        .setInteractive({ useHandCursor: true });
      text.on('pointerover', () => text.setColor('#ffd24a'));
      text.on('pointerout', () => text.setColor('#ffffff'));
      text.on('pointerdown', option.onSelect);
      y += 48;
    }
  }
}
