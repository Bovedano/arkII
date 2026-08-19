import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type CocheMercedesAzulParams = GameElementParams;

export class GECocheMercedesAzul extends Renderable(GameElement<CocheMercedesAzulParams>) {
  readonly type = 'CocheMercedesAzul';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'coche-mercedes-azul');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('CocheMercedesAzul', (args) => new GECocheMercedesAzul(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
