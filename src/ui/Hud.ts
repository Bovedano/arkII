import Phaser from 'phaser';
import { DomOverlay } from '../editor/DomOverlay';
import { fitToCanvas } from './CanvasAlign';
import { wireMenuActions } from './domMenu';
import type { HudSnapshot } from '../systems/GameSession';

export interface HudOptions {
  /** Invoked when the player taps the in-level exit button (mirrors the ESC key). */
  onExit: () => void;
}

/** Bottom status bar (lives, collectibles, countdown) shown during GameScene. */
export class Hud {
  private overlay: DomOverlay;
  private unbindAlign: () => void;
  private last: HudSnapshot | null = null;
  private heartEls: HTMLElement[];
  private collectedEl: HTMLElement;
  private totalEl: HTMLElement;
  private timerEl: HTMLElement;

  constructor(scene: Phaser.Scene, options: HudOptions) {
    this.overlay = new DomOverlay(scene, {});
    this.overlay.root.className = 'hud-root';
    this.overlay.root.innerHTML = `
      <div class="hud-bar">
        <div class="hud-left">
          <button type="button" class="hud-exit" data-action="exit" aria-label="Salir al menú">✕</button>
          <div class="hud-lives">${'<span class="hud-heart"></span>'.repeat(3)}</div>
        </div>
        <div class="hud-collectibles">🍺 <span data-field="collected">0</span>/<span data-field="total">0</span></div>
        <div class="hud-right">
          <div class="hud-timer" data-field="timer">05:00</div>
          <button type="button" class="hud-fullscreen" data-action="fullscreen" aria-label="Pantalla completa">⛶</button>
        </div>
      </div>
    `;
    wireMenuActions(this.overlay.root, { exit: options.onExit, fullscreen: () => this.toggleFullscreen() });
    this.heartEls = [...this.overlay.root.querySelectorAll<HTMLElement>('.hud-heart')];
    this.collectedEl = this.overlay.root.querySelector('[data-field="collected"]')!;
    this.totalEl = this.overlay.root.querySelector('[data-field="total"]')!;
    this.timerEl = this.overlay.root.querySelector('[data-field="timer"]')!;

    this.unbindAlign = fitToCanvas(scene, this.overlay.root);
    scene.events.once('shutdown', () => this.unbindAlign());
  }

  /** Cheap diff against the last painted snapshot — safe to call every frame. */
  refresh(snapshot: HudSnapshot): void {
    if (this.last?.lives !== snapshot.lives) {
      this.heartEls.forEach((el, i) => el.classList.toggle('empty', i >= snapshot.lives));
    }
    if (this.last?.collected !== snapshot.collected) this.collectedEl.textContent = String(snapshot.collected);
    if (this.last?.total !== snapshot.total) this.totalEl.textContent = String(snapshot.total);
    if (this.last?.timeRemainingSec !== snapshot.timeRemainingSec) {
      const minutes = Math.floor(snapshot.timeRemainingSec / 60);
      const seconds = snapshot.timeRemainingSec % 60;
      this.timerEl.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
      this.timerEl.classList.toggle('low', snapshot.timeRemainingSec <= 30);
    }
    this.last = snapshot;
  }

  private toggleFullscreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }
}
