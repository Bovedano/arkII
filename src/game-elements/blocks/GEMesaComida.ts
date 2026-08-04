import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type MesaComidaParams = GameElementParams;

export class GEMesaComida extends Renderable(GameElement<MesaComidaParams>) {
  readonly type = 'MesaComida';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'mesa-comida');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('MesaComida', (args) => new GEMesaComida(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
