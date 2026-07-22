import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { PhysicsBody } from '../core/mixins/PhysicsBody';
import { EventCapable } from '../core/mixins/EventCapable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';
import type { Ability } from './abilities/Ability';
import { AbilityRegistry } from './abilities/AbilityRegistry';
import { PENISTA_IDLE_KEYS } from '../../systems/animations';
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
const PENISTA_BODY_BOX = { width: 36, height: 62, offsetX: 2, offsetY: 0 };

export class GEPenista extends PhysicsBody(Renderable(EventCapable(GameElement<PenistaParams>))) {
  readonly type = 'Penista';
  facing: 'east' | 'west' = 'east';

  private activeAbilities: Ability[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  init(): void {
    const sprite = this.scene.physics.add.sprite(this.x, this.y, PENISTA_IDLE_KEYS.east);
    // NOTE: physics.add.sprite() already enables the Arcade body — do NOT also call
    // this.enablePhysics() here, that would attach a second/duplicate body.
    this.setVisual(sprite);
    this.setBodyBox(
      PENISTA_BODY_BOX.width,
      PENISTA_BODY_BOX.height,
      PENISTA_BODY_BOX.offsetX,
      PENISTA_BODY_BOX.offsetY,
    );

    const keyboard = this.scene.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input plugin is not available on this scene');
    this.cursors = keyboard.createCursorKeys();

    const startAbilities = this.params.abilities ?? ['run', 'jump'];
    for (const id of startAbilities) this.attachAbility(id);

    this.on('ability:unlock', (abilityId: string) => this.attachAbility(abilityId));
  }

  update(time: number, delta: number): void {
    for (let i = 0; i < this.activeAbilities.length; i++) {
      this.activeAbilities[i].update(time, delta);
    }
  }

  attachAbility(id: string): void {
    if (this.activeAbilities.some((a) => a.id === id)) return; // idempotent
    const ability = AbilityRegistry.create(id);
    ability.attach({ character: this, scene: this.scene, cursors: this.cursors });
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

  setVelocityX(value: number): void {
    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityX(value);
  }

  setVelocityY(value: number): void {
    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityY(value);
  }

  play(animKey: string): void {
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
