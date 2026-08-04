import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { PhysicsBody } from '../core/mixins/PhysicsBody';
import { EventCapable } from '../core/mixins/EventCapable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type CervezaEstrellaParams = GameElementParams;

/**
 * A collectible: emits a 'level-event' (`${id}:collected`) and removes itself the first
 * time the player overlaps it. GameScene's generic sensor wiring (behavior: 'sensor')
 * already calls trigger() on overlap — see GameScene.wireBehaviorInteractions().
 */
export class GECervezaEstrella extends EventCapable(PhysicsBody(Renderable(GameElement<CervezaEstrellaParams>))) {
  readonly type = 'CervezaEstrella';
  private collected = false;

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'cerveza-estrella');
    this.setVisual(image);
    this.enablePhysics(); // behavior: 'sensor' (default) always gets a static overlap-only body
  }

  /** Called by GameScene's overlap callback. Idempotent — firing twice is a no-op. */
  trigger(): void {
    if (this.collected) return;
    this.collected = true;
    this.emit('level-event', `${this.id}:collected`);
    this.destroy();
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('CervezaEstrella', (args) => new GECervezaEstrella(args as any), {
  defaultParams: { zIndex: 5, behavior: 'sensor' },
  paramSchema: [],
});
