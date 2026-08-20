import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';
import { ARBOL_VARIANTS } from '../../config/arbolVariants';

export interface ArbolParams extends GameElementParams {
  /** Texture key — filename of a variant in public/assets/blocks/arbol (see ARBOL_VARIANTS). */
  variant?: string;
}

export class GEArbol extends Renderable(GameElement<ArbolParams>) {
  readonly type = 'Arbol';

  init(): void {
    const textureKey = this.params.variant ?? ARBOL_VARIANTS[0];
    const image = this.scene.add.image(this.x, this.y, textureKey);
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('Arbol', (args) => new GEArbol(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background', variant: ARBOL_VARIANTS[0] },
  paramSchema: [{ key: 'variant', label: 'Variante', kind: 'select', default: ARBOL_VARIANTS[0], options: ARBOL_VARIANTS }],
});
