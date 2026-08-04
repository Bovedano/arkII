import Phaser from 'phaser';
import { DomOverlay } from '../editor/DomOverlay';
import { fitToCanvas } from './CanvasAlign';

type Axis = 'left' | 'right' | 'neutral';

/**
 * Left-side X-axis joystick + right-side jump/action buttons for touch devices. Drives the
 * same CursorKeys/actionKey objects the keyboard uses, via Phaser's public Key.onDown/onUp
 * (see node_modules/phaser/src/input/keyboard/keys/Key.js) — so Phaser.Input.Keyboard.JustDown
 * keeps working for the jump ability exactly as if a real keydown/keyup happened.
 */
export class TouchInputController {
  private overlay: DomOverlay;
  private unbindAlign: () => void;
  private activePointerId: number | null = null;
  private axisState: Axis = 'neutral';

  constructor(
    scene: Phaser.Scene,
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    private actionKey: Phaser.Input.Keyboard.Key,
  ) {
    this.overlay = new DomOverlay(scene, {});
    this.overlay.root.className = 'touch-controls-root';
    this.overlay.root.innerHTML = `
      <div class="touch-joystick" data-role="joystick"><div class="touch-joystick-knob"></div></div>
      <div class="touch-buttons">
        <button class="touch-btn" data-role="action">A</button>
        <button class="touch-btn" data-role="jump">&#x2B06;</button>
      </div>
    `;

    this.unbindAlign = fitToCanvas(scene, this.overlay.root);
    this.wireJoystick();
    this.wireButton('jump', cursors.up);
    this.wireButton('action', actionKey);
    scene.events.once('shutdown', () => {
      this.unbindAlign();
      this.releaseAll();
    });
  }

  private fakeEvent(timeStamp: number): KeyboardEvent {
    return { timeStamp } as KeyboardEvent;
  }

  private wireButton(role: string, key: Phaser.Input.Keyboard.Key): void {
    const el = this.overlay.root.querySelector<HTMLElement>(`[data-role="${role}"]`);
    if (!el) return;
    el.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      key.onDown(this.fakeEvent(event.timeStamp));
      el.classList.add('active');
    });
    const release = (event: PointerEvent) => {
      key.onUp(this.fakeEvent(event.timeStamp));
      el.classList.remove('active');
    };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('pointerleave', release);
  }

  private wireJoystick(): void {
    const base = this.overlay.root.querySelector<HTMLElement>('[data-role="joystick"]');
    const knob = base?.querySelector<HTMLElement>('.touch-joystick-knob');
    if (!base || !knob) return;

    const move = (clientX: number, clientY: number) => {
      const rect = base.getBoundingClientRect();
      const radius = rect.width / 2;
      let dx = clientX - (rect.left + radius);
      let dy = clientY - (rect.top + radius);
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        dx = (dx / dist) * radius;
        dy = (dy / dist) * radius;
      }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      this.setAxis(dx / radius);
    };
    const reset = () => {
      knob.style.transform = 'translate(0, 0)';
      this.setAxis(0);
    };

    base.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      this.activePointerId = event.pointerId;
      base.setPointerCapture(event.pointerId);
      move(event.clientX, event.clientY);
    });
    base.addEventListener('pointermove', (event) => {
      if (event.pointerId === this.activePointerId) move(event.clientX, event.clientY);
    });
    const end = (event: PointerEvent) => {
      if (event.pointerId === this.activePointerId) {
        this.activePointerId = null;
        reset();
      }
    };
    base.addEventListener('pointerup', end);
    base.addEventListener('pointercancel', end);
  }

  private setAxis(ratio: number): void {
    const DEADZONE = 0.3;
    const next: Axis = ratio < -DEADZONE ? 'left' : ratio > DEADZONE ? 'right' : 'neutral';
    if (next === this.axisState) return;

    const fake = this.fakeEvent(performance.now());
    if (this.axisState === 'left') this.cursors.left.onUp(fake);
    if (this.axisState === 'right') this.cursors.right.onUp(fake);
    if (next === 'left') this.cursors.left.onDown(fake);
    if (next === 'right') this.cursors.right.onDown(fake);
    this.axisState = next;
  }

  private releaseAll(): void {
    const fake = this.fakeEvent(performance.now());
    this.cursors.left.onUp(fake);
    this.cursors.right.onUp(fake);
    this.cursors.up.onUp(fake);
    this.actionKey.onUp(fake);
  }
}
