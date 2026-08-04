import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type RamaAlamoParams = GameElementParams;

export class GERamaAlamo extends Renderable(GameElement<RamaAlamoParams>) {
  readonly type = 'RamaAlamo';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'rama-alamo');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('RamaAlamo', (args) => new GERamaAlamo(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
