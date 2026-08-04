import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type ToyotaPickupParams = GameElementParams;

export class GEToyotaPickup extends Renderable(GameElement<ToyotaPickupParams>) {
  readonly type = 'ToyotaPickup';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'toyota-pickup');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('ToyotaPickup', (args) => new GEToyotaPickup(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
