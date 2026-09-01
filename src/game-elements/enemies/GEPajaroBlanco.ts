import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { PhysicsBody } from '../core/mixins/PhysicsBody';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';
import { PAJARO_BLANCO_ANIM_KEYS, PAJARO_BLANCO_TEXTURE_KEYS } from '../../systems/animations';

/**
 * Arcade body box within the 128x128 sprite frame — union of the non-transparent silhouette
 * across all 14 flight frames (east + west), so the collision box matches the bird's body/wing
 * span instead of the frame's transparent padding. Tune here if the sprite art changes.
 */
const PAJARO_BLANCO_BODY_BOX = { width: 46, height: 51, offsetX: 40, offsetY: 34 };

export interface PajaroBlancoParams extends GameElementParams {
  /** Total width of the east-west patrol, centered on the element's placed position. */
  patrolDistance?: number;
  /** Horizontal flight speed, in px/s. */
  speed?: number;
  /** Which way it heads first from its spawn point. */
  startDirection?: 'east' | 'west';
  /** Vertical wing-flap bobbing amplitude, in px. */
  bobAmplitude?: number;
  /** Vertical bobbing frequency, in cycles/s. */
  bobFrequency?: number;
}

/**
 * Flying enemy: patrols back and forth horizontally around its spawn point (ping-ponging at
 * +/-patrolDistance/2) with a sine-wave vertical bob layered on top, playing the matching
 * east/west wing-flap animation for its current heading. `behavior: 'damage'` — GameScene's
 * generic overlap wiring (wireBehaviorInteractions) costs the player a life on contact.
 *
 * Position is driven manually every frame rather than via Arcade velocity, since the vertical
 * motion is a sine wave, not a constant force — the body just gets synced to the visual
 * afterwards (updateFromGameObject) so overlap detection stays accurate.
 */
export class GEPajaroBlanco extends PhysicsBody(Renderable(GameElement<PajaroBlancoParams>)) {
  readonly type = 'PajaroBlanco';

  private spawnX = 0;
  private spawnY = 0;
  private direction: 1 | -1 = 1;
  private offset = 0;
  private bobAngle = 0;

  init(): void {
    this.spawnX = this.x;
    this.spawnY = this.y;
    this.direction = (this.params.startDirection ?? 'east') === 'east' ? 1 : -1;

    const initialFrames = this.direction === 1 ? PAJARO_BLANCO_TEXTURE_KEYS.flyEast : PAJARO_BLANCO_TEXTURE_KEYS.flyWest;
    const sprite = this.scene.add.sprite(this.x, this.y, initialFrames[0]);
    this.setVisual(sprite);
    this.enablePhysics();
    this.setBodyBox(
      PAJARO_BLANCO_BODY_BOX.width,
      PAJARO_BLANCO_BODY_BOX.height,
      PAJARO_BLANCO_BODY_BOX.offsetX,
      PAJARO_BLANCO_BODY_BOX.offsetY,
    );
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    // This enemy's transform is driven by hand every frame (setPosition + updateFromGameObject).
    // With body.moves left true, Arcade's postUpdate re-integrates (position - prevFrame) back onto
    // the sprite on physics-step frames — and since the fixed 60Hz step only fires on *some* frames
    // of a high-refresh display, that shoves the sprite a frame ahead then back: continuous flicker.
    // moves = false keeps the body tracking the sprite for overlap checks without writing back to it.
    body.moves = false;
    this.playFacingAnim();
  }

  update(_time: number, delta: number): void {
    const patrolDistance = this.params.patrolDistance ?? 240;
    const speed = this.params.speed ?? 90;
    const bobAmplitude = this.params.bobAmplitude ?? 8;
    const bobFrequency = this.params.bobFrequency ?? 1.6;
    const half = patrolDistance / 2;
    const dt = delta / 1000;

    this.offset += this.direction * speed * dt;
    if (this.offset > half) {
      this.offset = half;
      this.direction = -1;
      this.playFacingAnim();
    } else if (this.offset < -half) {
      this.offset = -half;
      this.direction = 1;
      this.playFacingAnim();
    }

    this.bobAngle += 2 * Math.PI * bobFrequency * dt;
    const y = this.spawnY + Math.sin(this.bobAngle) * bobAmplitude;

    const sprite = this.visual as Phaser.GameObjects.Sprite;
    sprite.setPosition(this.spawnX + this.offset, y);
    (this.body as Phaser.Physics.Arcade.Body).updateFromGameObject();
  }

  private playFacingAnim(): void {
    const key = this.direction === 1 ? PAJARO_BLANCO_ANIM_KEYS.flyEast : PAJARO_BLANCO_ANIM_KEYS.flyWest;
    (this.visual as Phaser.GameObjects.Sprite).play(key, true);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('PajaroBlanco', (args) => new GEPajaroBlanco(args as any), {
  defaultParams: {
    zIndex: 8,
    behavior: 'damage',
    patrolDistance: 240,
    speed: 90,
    startDirection: 'east',
    bobAmplitude: 8,
    bobFrequency: 1.6,
  },
  paramSchema: [
    { key: 'patrolDistance', label: 'Distancia de patrulla', kind: 'number', default: 240 },
    { key: 'speed', label: 'Velocidad (px/s)', kind: 'number', default: 90 },
    { key: 'startDirection', label: 'Dirección inicial', kind: 'select', default: 'east', options: ['east', 'west'] },
    { key: 'bobAmplitude', label: 'Amplitud aleteo (px)', kind: 'number', default: 8 },
    { key: 'bobFrequency', label: 'Frecuencia aleteo (Hz)', kind: 'number', default: 1.6 },
  ],
});
