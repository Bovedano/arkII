import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { PhysicsBody } from '../core/mixins/PhysicsBody';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';
import { AVISPA_ANIM_KEY, AVISPA_TEXTURE_KEYS } from '../../systems/animations';

/**
 * Arcade body box within the 124x108 sprite frame — roughly the wasp's body + folded-wing
 * silhouette, ignoring the transparent frame padding. Tune here if the sprite art changes.
 */
const AVISPA_BODY_BOX = { width: 62, height: 46, offsetX: 31, offsetY: 32 };

export interface AvispaParams extends GameElementParams {
  /** Horizontal diameter of the elliptical zone the wasp roams within, centered on spawn. */
  roamWidth?: number;
  /** Vertical diameter of that elliptical roam zone. */
  roamHeight?: number;
  /** Dart speed toward the current waypoint, in px/s. */
  speed?: number;
  /** How sharply the wasp can change heading: 0 = never turns, 1 = snaps instantly. */
  turnSharpness?: number;
  /** Seconds the wasp eases to a near-stop at a waypoint before darting to the next one. */
  hoverTime?: number;
}

/**
 * Flying enemy with an erratic, insect-like flight pattern (as opposed to GEPajaroBlanco's
 * smooth ping-pong patrol). The wasp picks random waypoints inside an ellipse around its
 * spawn point and darts between them — easing its velocity toward each new target rather than
 * snapping, so darts curve — then slows to a near-hover for `hoverTime` before the next dart.
 * The knobs are exposed via paramSchema so a level designer can dial the pattern from "lazy
 * drift" to "angry darting".
 *
 * `behavior: 'damage'` — GameScene's generic overlap wiring costs the player a life on contact.
 * Position is driven manually every frame (the path is procedural, not a constant force), then
 * the body is synced to the visual (updateFromGameObject) so overlap detection stays accurate.
 * The source art faces west; setFlipX mirrors it when the wasp is heading east.
 */
export class GEAvispa extends PhysicsBody(Renderable(GameElement<AvispaParams>)) {
  readonly type = 'Avispa';

  private spawnX = 0;
  private spawnY = 0;
  private baseX = 0;
  private baseY = 0;
  private velX = 0;
  private velY = 0;
  private targetX = 0;
  private targetY = 0;
  private hoverTimer = 0;

  init(): void {
    this.spawnX = this.x;
    this.spawnY = this.y;
    this.baseX = this.x;
    this.baseY = this.y;
    this.targetX = this.x;
    this.targetY = this.y;
    this.hoverTimer = this.params.hoverTime ?? 0.4;

    const sprite = this.scene.add.sprite(this.x, this.y, AVISPA_TEXTURE_KEYS[0]);
    this.setVisual(sprite);
    this.enablePhysics();
    this.setBodyBox(AVISPA_BODY_BOX.width, AVISPA_BODY_BOX.height, AVISPA_BODY_BOX.offsetX, AVISPA_BODY_BOX.offsetY);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    // This enemy's transform is driven by hand every frame (setPosition + updateFromGameObject).
    // With body.moves left true, Arcade's postUpdate re-integrates (position - prevFrame) back onto
    // the sprite on physics-step frames — and since the fixed 60Hz step only fires on *some* frames
    // of a high-refresh display, that shoves the sprite a frame ahead then back: continuous flicker.
    // moves = false keeps the body tracking the sprite for overlap checks without writing back to it.
    body.moves = false;
    sprite.play(AVISPA_ANIM_KEY);
  }

  update(_time: number, delta: number): void {
    const roamWidth = this.params.roamWidth ?? 220;
    const roamHeight = this.params.roamHeight ?? 140;
    const speed = this.params.speed ?? 130;
    const turnSharpness = Phaser.Math.Clamp(this.params.turnSharpness ?? 0.12, 0.01, 1);
    const hoverTime = this.params.hoverTime ?? 0.4;
    const dt = delta / 1000;
    // Per-frame easing factor, normalized to 60fps so behaviour is frame-rate independent.
    const ease = 1 - Math.pow(1 - turnSharpness, dt * 60);

    if (this.hoverTimer > 0) {
      // Slowing to a near-hover at the waypoint, then pick the next target.
      this.hoverTimer -= dt;
      this.velX += (0 - this.velX) * ease;
      this.velY += (0 - this.velY) * ease;
      if (this.hoverTimer <= 0) this.pickWaypoint(roamWidth, roamHeight);
    } else {
      const dx = this.targetX - this.baseX;
      const dy = this.targetY - this.baseY;
      const dist = Math.hypot(dx, dy);
      if (dist < 4) {
        this.hoverTimer = hoverTime;
      } else {
        // Ease the velocity vector toward "straight at the target at full speed" so the wasp
        // banks into a new heading instead of turning on a dime.
        const desiredX = (dx / dist) * speed;
        const desiredY = (dy / dist) * speed;
        this.velX += (desiredX - this.velX) * ease;
        this.velY += (desiredY - this.velY) * ease;
      }
    }

    this.baseX += this.velX * dt;
    this.baseY += this.velY * dt;

    const sprite = this.visual as Phaser.GameObjects.Sprite;
    sprite.setPosition(Math.round(this.baseX), Math.round(this.baseY));
    if (this.velX > 4) sprite.setFlipX(true);
    else if (this.velX < -4) sprite.setFlipX(false);
    (this.body as Phaser.Physics.Arcade.Body).updateFromGameObject();
  }

  /** Random point inside the roam ellipse (centered on spawn); sqrt on the radius keeps the
   *  distribution from clustering in the middle. */
  private pickWaypoint(roamWidth: number, roamHeight: number): void {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random());
    this.targetX = this.spawnX + Math.cos(angle) * radius * (roamWidth / 2);
    this.targetY = this.spawnY + Math.sin(angle) * radius * (roamHeight / 2);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('Avispa', (args) => new GEAvispa(args as any), {
  defaultParams: {
    zIndex: 8,
    behavior: 'damage',
    roamWidth: 220,
    roamHeight: 140,
    speed: 130,
    turnSharpness: 0.12,
    hoverTime: 0.4,
  },
  paramSchema: [
    { key: 'roamWidth', label: 'Zona de vuelo: ancho (px)', kind: 'number', default: 220 },
    { key: 'roamHeight', label: 'Zona de vuelo: alto (px)', kind: 'number', default: 140 },
    { key: 'speed', label: 'Velocidad de embestida (px/s)', kind: 'number', default: 130 },
    { key: 'turnSharpness', label: 'Agilidad de giro (0-1)', kind: 'number', default: 0.12 },
    { key: 'hoverTime', label: 'Tiempo suspendida (s)', kind: 'number', default: 0.4 },
  ],
});
