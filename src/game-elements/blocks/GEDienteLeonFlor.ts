import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type DienteLeonFlorParams = GameElementParams;

export class GEDienteLeonFlor extends Renderable(GameElement<DienteLeonFlorParams>) {
  readonly type = 'DienteLeonFlor';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'diente-leon-flor');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('DienteLeonFlor', (args) => new GEDienteLeonFlor(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
