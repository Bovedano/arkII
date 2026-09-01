import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { PhysicsBody } from '../core/mixins/PhysicsBody';
import { EventCapable } from '../core/mixins/EventCapable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';
import {
  CORAZON_CRISTAL_NARANJA_ANIM_KEY,
  CORAZON_CRISTAL_NARANJA_TEXTURE_KEYS,
} from '../../systems/animations';

export type CorazonCristalNaranjaParams = GameElementParams;

/**
 * An extra-life pickup: an orange heart-shaped crystal that gently pulses in a loop. While
 * the player overlaps it, it emits a 'level-event' (`${id}:extra-life`); GameScene's handler
 * restores one lost life and then destroys this element — but only if the player wasn't
 * already at full lives, so a full-health player simply can't pick it up and it stays for
 * later. Built like GECervezaEstrella (behavior: 'sensor', GameScene's generic sensor wiring
 * calls trigger() on overlap) but with a looping sprite animation, and it deliberately does
 * NOT remove itself in trigger() — GameScene owns the "was a life actually restored?" call.
 */
export class GECorazonCristalNaranja extends EventCapable(
  PhysicsBody(Renderable(GameElement<CorazonCristalNaranjaParams>)),
) {
  readonly type = 'CorazonCristalNaranja';

  init(): void {
    const sprite = this.scene.add.sprite(this.x, this.y, CORAZON_CRISTAL_NARANJA_TEXTURE_KEYS[0]);
    this.setVisual(sprite);
    this.enablePhysics(); // behavior: 'sensor' (default) always gets a static overlap-only body
    sprite.play(CORAZON_CRISTAL_NARANJA_ANIM_KEY);
  }

  /** Called by GameScene's overlap callback every frame the player is touching the crystal.
   *  Cheap to fire repeatedly: GameScene ignores it when lives are full, and destroys this
   *  element the moment a life is actually restored. */
  trigger(): void {
    this.emit('level-event', `${this.id}:extra-life`);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('CorazonCristalNaranja', (args) => new GECorazonCristalNaranja(args as any), {
  defaultParams: { zIndex: 5, behavior: 'sensor' },
  paramSchema: [],
});
