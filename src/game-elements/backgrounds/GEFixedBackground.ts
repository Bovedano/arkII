import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';
import { BACKGROUND_ASSETS } from '../../config/backgroundAssets';

export interface FixedBackgroundParams extends GameElementParams {
  /** Texture key — filename of an image in public/assets/backgrounds (see BACKGROUND_ASSETS). */
  image?: string;
  /** How much this layer deviates from perfectly following the camera, as a percentage (0-100).
   *  0 (default) = glued to the screen, i.e. it tracks the player/camera exactly. 100 = scrolls
   *  at the normal world rate, i.e. doesn't follow at all (behaves like any other level element).
   *  Stacking several instances with different deviations is what sells the 3D depth illusion —
   *  low deviation for far layers, higher for near ones. Omitted = 0. */
  parallaxX?: number;
  /** Same as parallaxX, vertical. Omitted = 0. */
  parallaxY?: number;
}

/**
 * Placeable background layer that follows the camera by default (Phaser's native scrollFactor
 * set to 0), so it stays anchored to the player like a true "background" instead of scrolling
 * past with the rest of the level. parallaxX/Y dial in how much it deviates from that perfect
 * follow, letting several stacked instances move at different speeds for a 3D depth effect.
 */
export class GEFixedBackground extends Renderable(GameElement<FixedBackgroundParams>) {
  readonly type = 'FixedBackground';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, this.params.image ?? 'paisaje.png');
    this.setVisual(image);
    image.setScrollFactor((this.params.parallaxX ?? 0) / 100, (this.params.parallaxY ?? 0) / 100);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('FixedBackground', (args) => new GEFixedBackground(args as any), {
  defaultParams: { zIndex: -50, behavior: 'background', image: 'paisaje.png', parallaxX: 0, parallaxY: 0 },
  paramSchema: [
    { key: 'image', label: 'Imagen', kind: 'select', default: 'paisaje.png', options: BACKGROUND_ASSETS },
    { key: 'parallaxX', label: 'Desviación X (%)', kind: 'number', default: 0 },
    { key: 'parallaxY', label: 'Desviación Y (%)', kind: 'number', default: 0 },
  ],
});
