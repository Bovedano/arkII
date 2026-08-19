import Phaser from 'phaser';
import { LEVEL_REGISTRY } from '../levels/levelRegistry';
import { LevelLoader } from '../systems/LevelLoader';
import { getGameState } from '../systems/GameState';
import { DomOverlay } from '../editor/DomOverlay';
import { renderMenuOption, wireMenuActions } from '../ui/domMenu';
import { formatTime } from '../ui/format';

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

    const rows = LEVEL_REGISTRY.map((meta) => {
      const unlockId = childLevelToUnlockId.get(meta.id);
      const locked = unlockId !== undefined && !gameState.isSublevelUnlocked(unlockId);
      const label = locked ? '??? (bloqueado)' : meta.title;
      const bestTimeSec = !locked ? gameState.getBestTimeSec(meta.id) : undefined;
      const suffix = bestTimeSec !== undefined ? `✓ ${formatTime(bestTimeSec)}` : undefined;
      return renderMenuOption({ action: `level:${meta.id}`, label, locked, suffix });
    });

    const overlay = new DomOverlay(this, {});
    overlay.root.className = 'menu-overlay';
    overlay.root.innerHTML = `
      <div class="menu-back" data-action="back">&lt; Volver</div>
      <div class="menu-subtitle">Selecciona un nivel</div>
      <div class="menu-list">${rows.join('')}</div>
    `;

    const handlers: Record<string, () => void> = { back: () => this.scene.start('MainMenu') };
    for (const meta of LEVEL_REGISTRY) {
      handlers[`level:${meta.id}`] = () => this.scene.start('Game', { levelId: meta.id });
    }
    wireMenuActions(overlay.root, handlers);
  }
}
