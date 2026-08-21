import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type VolvoXc40Params = GameElementParams;

export class GEVolvoXc40 extends Renderable(GameElement<VolvoXc40Params>) {
  readonly type = 'VolvoXc40';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'volvo-xc40');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('VolvoXc40', (args) => new GEVolvoXc40(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
