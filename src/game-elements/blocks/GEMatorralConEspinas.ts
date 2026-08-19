import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type MatorralConEspinasParams = GameElementParams;

export class GEMatorralConEspinas extends Renderable(GameElement<MatorralConEspinasParams>) {
  readonly type = 'MatorralConEspinas';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'matorral-con-espinas');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('MatorralConEspinas', (args) => new GEMatorralConEspinas(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
