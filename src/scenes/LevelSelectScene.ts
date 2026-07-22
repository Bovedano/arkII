import Phaser from 'phaser';
import { LEVEL_REGISTRY } from '../levels/levelRegistry';
import { LevelLoader } from '../systems/LevelLoader';
import { getGameState } from '../systems/GameState';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelect');
  }

  create(): void {
    const gameState = getGameState(this.registry);

    // A level is "locked" if some other level declares it as a sublevel and the matching
    // unlock event hasn't fired yet. Built by parsing every level's JSON once, here.
    const childLevelToUnlockId = new Map<string, string>();
    for (const meta of LEVEL_REGISTRY) {
      const parsed = LevelLoader.parse(meta.text);
      for (const sub of parsed.sublevels ?? []) {
        childLevelToUnlockId.set(sub.level, sub.id);
      }
    }

    this.add.text(480, 60, 'Super T — Selecciona un nivel', {
      fontSize: '28px',
      color: '#ffffff',
    }).setOrigin(0.5, 0);

    const backText = this.add
      .text(20, 20, '< Menú', { fontSize: '18px', color: '#cccccc' })
      .setInteractive({ useHandCursor: true });
    backText.on('pointerover', () => backText.setColor('#ffd24a'));
    backText.on('pointerout', () => backText.setColor('#cccccc'));
    backText.on('pointerdown', () => this.scene.start('MainMenu'));

    let y = 160;
    for (const meta of LEVEL_REGISTRY) {
      const unlockId = childLevelToUnlockId.get(meta.id);
      const locked = unlockId !== undefined && !gameState.isSublevelUnlocked(unlockId);

      const label = locked ? '??? (bloqueado)' : meta.title;
      const text = this.add
        .text(480, y, label, {
          fontSize: '22px',
          color: locked ? '#666666' : '#ffffff',
        })
        .setOrigin(0.5, 0);

      if (!locked) {
        text.setInteractive({ useHandCursor: true });
        text.on('pointerover', () => text.setColor('#ffd24a'));
        text.on('pointerout', () => text.setColor('#ffffff'));
        text.on('pointerdown', () => this.scene.start('Game', { levelId: meta.id }));
      }

      y += 44;
    }
  }
}
