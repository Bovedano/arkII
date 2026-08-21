import Phaser from 'phaser';
import { DomOverlay } from '../editor/DomOverlay';
import { wireMenuActions } from './domMenu';
import { formatTime } from './format';
import { appConfig } from '../config/appConfig';

export interface LevelCompleteOptions {
  levelTitle: string;
  timeSec: number;
  isNewRecord: boolean;
  bestTimeSec: number;
  onRetry: () => void;
  onLevelSelect: () => void;
}

/** Full-screen HTML overlay (same fixed/inset-0 pattern as the menu scenes, not
 *  canvas-aligned) shown once a level's last collectible is picked up. */
export class LevelCompleteScreen {
  private overlay: DomOverlay;

  constructor(scene: Phaser.Scene, options: LevelCompleteOptions) {
    const { levelTitle, timeSec, isNewRecord, bestTimeSec } = options;
    const shareText = `¡He completado "${levelTitle}" en ${formatTime(timeSec)} en ${appConfig.name}!`;
    const shareUrl = window.location.href;

    this.overlay = new DomOverlay(scene, {});
    this.overlay.root.className = 'level-complete-overlay';
    this.overlay.root.innerHTML = `
      <div class="level-complete-title">¡Nivel completado!</div>
      <div class="level-complete-subtitle">${levelTitle}</div>
      <div class="level-complete-time">Tiempo: ${formatTime(timeSec)}</div>
      <div class="level-complete-record ${isNewRecord ? 'is-new' : ''}">
        ${isNewRecord ? '🏆 ¡Nuevo récord!' : `Mejor tiempo: ${formatTime(bestTimeSec)}`}
      </div>
      <div class="level-complete-share">
        <div class="level-complete-share-label">Compartir</div>
        <div class="level-complete-share-row">
          <div class="menu-option share-btn" data-action="share:whatsapp">WhatsApp</div>
          <div class="menu-option share-btn" data-action="share:x">X</div>
          <div class="menu-option share-btn" data-action="share:facebook">Facebook</div>
          <div class="menu-option share-btn" data-action="share:copy" data-field="copy">Copiar enlace</div>
        </div>
      </div>
      <div class="level-complete-actions">
        <div class="menu-option" data-action="retry">Reintentar</div>
        <div class="menu-option" data-action="level-select">Volver a niveles</div>
      </div>
    `;

    const copyEl = this.overlay.root.querySelector<HTMLElement>('[data-field="copy"]')!;
    wireMenuActions(this.overlay.root, {
      'share:whatsapp': () =>
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank', 'noopener,noreferrer'),
      'share:x': () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'noopener,noreferrer',
        ),
      'share:facebook': () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'noopener,noreferrer',
        ),
      'share:copy': () => {
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
          copyEl.textContent = '¡Copiado!';
          setTimeout(() => (copyEl.textContent = 'Copiar enlace'), 1500);
        });
      },
      retry: options.onRetry,
      'level-select': options.onLevelSelect,
    });
  }
}
