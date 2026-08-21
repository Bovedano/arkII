import Phaser from 'phaser';
import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { PhysicsBody } from '../core/mixins/PhysicsBody';
import { EventCapable } from '../core/mixins/EventCapable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';
import { RESPAWN_STATIC_KEY, RESPAWN_WAVE_ANIM_KEY } from '../../systems/animations';

export type RespawnParams = GameElementParams;

/**
 * Collision box within the 168x168 sprite frame — measured from the actual (non-transparent)
 * silhouette across the static pose and all 7 wave frames, so the checkpoint only triggers
 * when the player actually touches the flag/pole instead of the sprite's large transparent
 * margin. The box stays fixed (doesn't resize per animation frame, like GEEsporaDienteLeon's),
 * so its height covers the tallest extent the waving flag reaches.
 */
const BODY_BOX = { width: 62, height: 133, offsetX: 54, offsetY: 17 };

/**
 * A checkpoint flag: static until the player overlaps it, then becomes the level's active
 * respawn point (flag animation starts waving) and emits `${id}:respawn` so GameScene can
 * update where the player reappears after losing a life. Several can exist in one level —
 * GameScene deactivates every other instance (back to the static pose) whenever a new one
 * is triggered, so only the most recently touched flag ever waves. See
 * GameScene.activateRespawn(), which owns the cross-instance coordination — this class only
 * tracks its own active/inactive visual state.
 */
export class GERespawn extends EventCapable(PhysicsBody(Renderable(GameElement<RespawnParams>))) {
  readonly type = 'Respawn';
  private active = false;

  init(): void {
    const sprite = this.scene.add.sprite(this.x, this.y, RESPAWN_STATIC_KEY);
    this.setVisual(sprite);
    this.enablePhysics(); // behavior: 'sensor' (default) always gets a static overlap-only body
    this.setBodyBox(BODY_BOX.width, BODY_BOX.height, BODY_BOX.offsetX, BODY_BOX.offsetY);
  }

  /** Called by GameScene's overlap callback. No-op if this is already the active respawn point. */
  trigger(): void {
    if (this.active) return;
    this.emit('level-event', `${this.id}:respawn`);
  }

  /** Called by GameScene.activateRespawn() on every Respawn instance in the level — true for
   *  the one just triggered, false for the rest. */
  setActive(active: boolean): void {
    if (this.active === active) return;
    this.active = active;
    const sprite = this.visual as Phaser.GameObjects.Sprite;
    if (active) {
      sprite.play(RESPAWN_WAVE_ANIM_KEY);
    } else {
      sprite.anims.stop();
      sprite.setTexture(RESPAWN_STATIC_KEY);
    }
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('Respawn', (args) => new GERespawn(args as any), {
  defaultParams: { zIndex: 5, behavior: 'sensor' },
  paramSchema: [],
});
