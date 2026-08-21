import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type CocheDaciaLodgyGrisParams = GameElementParams;

export class GECocheDaciaLodgyGris extends Renderable(GameElement<CocheDaciaLodgyGrisParams>) {
  readonly type = 'CocheDaciaLodgyGris';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'coche-dacia-lodgy-gris');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('CocheDaciaLodgyGris', (args) => new GECocheDaciaLodgyGris(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
