import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type CocheSeatIbizaParams = GameElementParams;

export class GECocheSeatIbiza extends Renderable(GameElement<CocheSeatIbizaParams>) {
  readonly type = 'CocheSeatIbiza';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'coche-seat-ibiza');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('CocheSeatIbiza', (args) => new GECocheSeatIbiza(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
