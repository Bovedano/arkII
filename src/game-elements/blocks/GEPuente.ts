import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type PuenteParams = GameElementParams;

export class GEPuente extends Renderable(GameElement<PuenteParams>) {
  readonly type = 'Puente';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'puente');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('Puente', (args) => new GEPuente(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
