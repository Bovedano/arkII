import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type ArbolParams = GameElementParams;

export class GEArbol extends Renderable(GameElement<ArbolParams>) {
  readonly type = 'Arbol';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'arbol');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('Arbol', (args) => new GEArbol(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
