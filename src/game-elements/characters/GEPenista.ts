import Phaser from 'phaser';
import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { PhysicsBody } from '../core/mixins/PhysicsBody';
import { EventCapable } from '../core/mixins/EventCapable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';
import type { Ability } from './abilities/Ability';
import { AbilityRegistry } from './abilities/AbilityRegistry';
import { PENISTA_DEATH_FRONT_KEY, PENISTA_IDLE_KEYS } from '../../systems/animations';
// Side-effect imports: registers each ability with AbilityRegistry.
import './abilities/RunAbility';
import './abilities/JumpAbility';
import './abilities/DoubleJumpAbility';

export interface PenistaParams extends GameElementParams {
  /** Starting ability ids. Defaults to ['run', 'jump'] if omitted. */
  abilities?: string[];
}

/**
 * Arcade body box within the 48x68 sprite frame — measured from the actual (non-transparent)
 * silhouette across idle/run/jump frames, so collisions match the drawn character instead of
 * the frame's remaining transparent padding. Tune here if the sprite art changes.
 */
const PENISTA_BODY_BOX = { width: 30, height: 62, offsetX: 6, offsetY: 0 };

/** Upward speed of the Mario-style death bounce — noticeably stronger than the regular jump
 *  (JumpAbility uses -400) so the hop reads clearly before gravity pulls it back down. */
const DEATH_BOUNCE_VELOCITY_Y = -260;

/** The death-front sprite's source art (124x124) is a different size than the 48x68 profile
 *  frames — scale it down so its displayed height roughly matches the normal standing pose. */
const DEATH_FRONT_SCALE_FACTOR = 68 / 124;

export class GEPenista extends PhysicsBody(Renderable(EventCapable(GameElement<PenistaParams>))) {
  readonly type = 'Penista';
  facing: 'east' | 'west' = 'east';

  private activeAbilities: Ability[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private actionKey!: Phaser.Input.Keyboard.Key;
  private dying = false;
  /** The sprite's scale as set by params.scale (or 1 if unset) — captured once so the death-front
   *  pose (a differently-proportioned source image) can be sized relative to it, then restored. */
  private baseScale = 1;

  init(): void {
    const sprite = this.scene.physics.add.sprite(this.x, this.y, PENISTA_IDLE_KEYS.east);
    // NOTE: physics.add.sprite() already enables the Arcade body — do NOT also call
    // this.enablePhysics() here, that would attach a second/duplicate body.
    this.setVisual(sprite);
    this.baseScale = sprite.scaleX;
    this.setBodyBox(
      PENISTA_BODY_BOX.width,
      PENISTA_BODY_BOX.height,
      PENISTA_BODY_BOX.offsetX,
      PENISTA_BODY_BOX.offsetY,
    );

    const keyboard = this.scene.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input plugin is not available on this scene');
    this.cursors = keyboard.createCursorKeys();
    this.actionKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    const startAbilities = this.params.abilities ?? ['run', 'jump'];
    for (const id of startAbilities) this.attachAbility(id);

    this.on('ability:unlock', (abilityId: string) => this.attachAbility(abilityId));
  }

  update(time: number, delta: number): void {
    if (this.dying) return; // ignore input/abilities while the death bounce plays out
    for (let i = 0; i < this.activeAbilities.length; i++) {
      this.activeAbilities[i].update(time, delta);
    }
  }

  attachAbility(id: string): void {
    if (this.activeAbilities.some((a) => a.id === id)) return; // idempotent
    const ability = AbilityRegistry.create(id);
    ability.attach({ character: this, scene: this.scene, cursors: this.cursors, actionKey: this.actionKey });
    this.activeAbilities.push(ability);
  }

  detachAbility(id: string): void {
    const idx = this.activeAbilities.findIndex((a) => a.id === id);
    if (idx === -1) return;
    this.activeAbilities[idx].detach();
    this.activeAbilities.splice(idx, 1);
  }

  private get sprite(): Phaser.Physics.Arcade.Sprite {
    return this.visual as Phaser.Physics.Arcade.Sprite;
  }

  isGrounded(): boolean {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    return body.blocked.down || body.touching.down;
  }

  getCursors(): Phaser.Types.Input.Keyboard.CursorKeys {
    return this.cursors;
  }

  /** Repositions and stops the character in place — used by GameScene after a fall/timeout,
   *  without recreating the element. Also clears any in-progress death bounce. */
  respawnAt(x: number, y: number): void {
    this.dying = false;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.checkCollision.none = false;
    this.sprite.setPosition(x, y);
    this.sprite.setScale(this.baseScale);
    body.setVelocity(0, 0);
    this.facing = 'east';
    this.showIdle();
  }

  /** Mario-style death bounce: hops upward, falls through everything (collision disabled so it
   *  doesn't land on a platform mid-fall), and keeps dropping until GameScene sees it clear the
   *  camera view and calls respawnAt(). Input/abilities are ignored for the duration (see update()).
   *  Freezes on the front-facing (camera-facing) pose rather than the side profile, like classic
   *  Mario turning to face the screen when he dies. */
  startDeathBounce(): void {
    this.dying = true;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.checkCollision.none = true;
    body.setVelocity(0, DEATH_BOUNCE_VELOCITY_Y);
    this.sprite.anims.stop();
    this.sprite.setTexture(PENISTA_DEATH_FRONT_KEY);
    this.sprite.setScale(this.baseScale * DEATH_FRONT_SCALE_FACTOR);
  }

  isDying(): boolean {
    return this.dying;
  }

  setVelocityX(value: number): void {
    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityX(value);
  }

  setVelocityY(value: number): void {
    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityY(value);
  }

  /** Forces the animation to (re)start from frame 0. Used only at the instant of a jump,
   *  so a second jump right after landing still replays the jump cycle from the beginning. */
  play(animKey: string): void {
    this.sprite.play(animKey);
  }

  /** Per-frame facing/state sync: switches animation only when the key actually changes.
   *  A finished non-looping animation (the jump) keeps its key as `currentAnim`, so this
   *  leaves it resting on its last frame instead of restarting it from frame 0 every tick
   *  (which looked like flickering while holding a direction in mid-air). */
  syncAnim(animKey: string): void {
    if (this.sprite.anims.currentAnim?.key === animKey) return;
    this.sprite.play(animKey, true);
  }

  /** Stops any looping animation and shows the static standing pose for the current facing. */
  showIdle(): void {
    const key = this.facing === 'east' ? PENISTA_IDLE_KEYS.east : PENISTA_IDLE_KEYS.west;
    if (this.sprite.texture.key === key) return; // already idle with the right facing
    this.sprite.anims.stop();
    this.sprite.setTexture(key);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('Penista', (args) => new GEPenista(args as any), {
  defaultParams: { abilities: ['run', 'jump'], zIndex: 10, behavior: 'solid' },
  paramSchema: [],
});
