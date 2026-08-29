import Phaser from 'phaser';
import { DomOverlay } from '../editor/DomOverlay';
import { fitToCanvas } from './CanvasAlign';

type Axis = 'left' | 'right' | 'neutral';

const JOYSTICK_RADIUS = 60; // design px — knob travel limit and full-tilt distance
const DEADZONE = 0.3;

/**
 * Touch controls for app / mobile play. The screen is split into two halves:
 *   - Right half: tapping or holding anywhere presses "jump" (cursors.up).
 *   - Left half: touching anywhere drops a floating movement joystick centred on that
 *     point; dragging from there steers the X axis (cursors.left / cursors.right). The
 *     player never has to hit the joystick where it happens to sit.
 * Drives the same CursorKeys the keyboard uses, via Phaser's public Key.onDown/onUp
 * (see node_modules/phaser/src/input/keyboard/keys/Key.js) — so
 * Phaser.Input.Keyboard.JustDown keeps working for the jump ability exactly as if a
 * real keydown/keyup happened.
 */
export class TouchInputController {
  private overlay: DomOverlay;
  private unbindAlign: () => void;

  private moveZone: HTMLElement;
  private joystick: HTMLElement;
  private knob: HTMLElement;
  private jumpBtn: HTMLElement;

  private movePointerId: number | null = null;
  private origin = { x: 0, y: 0 }; // design-space centre of the active joystick
  private axisState: Axis = 'neutral';
  private jumpPointers = new Set<number>();

  constructor(
    private scene: Phaser.Scene,
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  ) {
    // Below the HUD overlay (z 10000) so its exit / fullscreen buttons stay tappable;
    // the HUD root is pointer-events: none, so non-button taps there fall through here.
    this.overlay = new DomOverlay(scene, { zIndex: '9999' });
    this.overlay.root.className = 'touch-controls-root';
    this.overlay.root.innerHTML = `
      <div class="touch-zone touch-zone-move" data-role="move"></div>
      <div class="touch-zone touch-zone-jump" data-role="jump"></div>
      <button class="touch-jump-btn">&#x2B06;</button>
      <div class="touch-joystick"><div class="touch-joystick-knob"></div></div>
    `;

    this.moveZone = this.overlay.root.querySelector<HTMLElement>('[data-role="move"]')!;
    this.jumpBtn = this.overlay.root.querySelector<HTMLElement>('.touch-jump-btn')!;
    this.joystick = this.overlay.root.querySelector<HTMLElement>('.touch-joystick')!;
    this.knob = this.joystick.querySelector<HTMLElement>('.touch-joystick-knob')!;

    this.unbindAlign = fitToCanvas(scene, this.overlay.root);
    this.wireMoveZone();
    this.wireJumpZone();

    scene.events.once('shutdown', () => {
      this.unbindAlign();
      this.releaseAll();
    });
  }

  private fakeEvent(timeStamp: number): KeyboardEvent {
    return { timeStamp } as KeyboardEvent;
  }

  /** Converts client (screen) px into the overlay's 960x540 design space. */
  private toDesign(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.overlay.root.getBoundingClientRect();
    const scale = rect.width / this.scene.scale.baseSize.width || 1;
    return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale };
  }

  private wireJumpZone(): void {
    const zone = this.overlay.root.querySelector<HTMLElement>('[data-role="jump"]');
    if (!zone) return;

    const press = (event: PointerEvent) => {
      event.preventDefault();
      zone.setPointerCapture(event.pointerId);
      const wasIdle = this.jumpPointers.size === 0;
      this.jumpPointers.add(event.pointerId);
      if (wasIdle) {
        this.cursors.up.onDown(this.fakeEvent(event.timeStamp));
        this.jumpBtn.classList.add('active');
      }
    };
    const release = (event: PointerEvent) => {
      if (!this.jumpPointers.delete(event.pointerId)) return;
      if (this.jumpPointers.size === 0) {
        this.cursors.up.onUp(this.fakeEvent(event.timeStamp));
        this.jumpBtn.classList.remove('active');
      }
    };

    zone.addEventListener('pointerdown', press);
    zone.addEventListener('pointerup', release);
    zone.addEventListener('pointercancel', release);
  }

  private wireMoveZone(): void {
    const zone = this.moveZone;

    const start = (event: PointerEvent) => {
      event.preventDefault();
      if (this.movePointerId !== null) return;
      this.movePointerId = event.pointerId;
      zone.setPointerCapture(event.pointerId);
      this.origin = this.toDesign(event.clientX, event.clientY);
      this.joystick.style.left = `${this.origin.x}px`;
      this.joystick.style.top = `${this.origin.y}px`;
      this.joystick.classList.add('visible');
      this.knob.style.transform = 'translate(0, 0)';
    };
    const move = (event: PointerEvent) => {
      if (event.pointerId !== this.movePointerId) return;
      const p = this.toDesign(event.clientX, event.clientY);
      let dx = p.x - this.origin.x;
      let dy = p.y - this.origin.y;
      const dist = Math.hypot(dx, dy);
      if (dist > JOYSTICK_RADIUS) {
        dx = (dx / dist) * JOYSTICK_RADIUS;
        dy = (dy / dist) * JOYSTICK_RADIUS;
      }
      this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
      this.setAxis(dx / JOYSTICK_RADIUS);
    };
    const end = (event: PointerEvent) => {
      if (event.pointerId !== this.movePointerId) return;
      this.movePointerId = null;
      this.joystick.classList.remove('visible');
      this.knob.style.transform = 'translate(0, 0)';
      this.setAxis(0);
    };

    zone.addEventListener('pointerdown', start);
    zone.addEventListener('pointermove', move);
    zone.addEventListener('pointerup', end);
    zone.addEventListener('pointercancel', end);
  }

  private setAxis(ratio: number): void {
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
  }
}
