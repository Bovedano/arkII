import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type CocheOpelInsigniaNegroParams = GameElementParams;

export class GECocheOpelInsigniaNegro extends Renderable(GameElement<CocheOpelInsigniaNegroParams>) {
  readonly type = 'CocheOpelInsigniaNegro';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'coche-opel-insignia-negro');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('CocheOpelInsigniaNegro', (args) => new GECocheOpelInsigniaNegro(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
