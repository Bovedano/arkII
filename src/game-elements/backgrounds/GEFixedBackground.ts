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
  /** Total tiles shown side by side, extending to the left of the placed x/y (1 = just the
   *  original image). Each extra tile mirrors the one next to it horizontally (flipX alternates
   *  tile to tile) so the seam between copies lines up — most background art isn't horizontally
   *  tileable as-is, but IS symmetric under a mirror, so alternating flips hides the repeat.
   *  Omitted = 1. */
  repeatX?: number;
}

/**
 * Placeable background layer that follows the camera by default (Phaser's native scrollFactor
 * set to 0), so it stays anchored to the player like a true "background" instead of scrolling
 * past with the rest of the level. parallaxX/Y dial in how much it deviates from that perfect
 * follow, letting several stacked instances move at different speeds for a 3D depth effect.
 */
export class GEFixedBackground extends Renderable(GameElement<FixedBackgroundParams>) {
  readonly type = 'FixedBackground';

  /** Extra mirrored copies beyond `this.visual` (the original) — see `repeatX`. Renderable's
   *  destroy() only knows about `this.visual`, so these are cleaned up in our own destroy().
   *  Exposed as `extraVisuals` (see GameElementLike) so the level editor's preview adds them to
   *  its own container too — otherwise they'd render in raw scene coordinates in the editor. */
  readonly extraVisuals: Phaser.GameObjects.Image[] = [];

  init(): void {
    const textureKey = this.params.image ?? 'paisaje.png';
    // Snapped to whole pixels: two separately-drawn images placed edge-to-edge at fractional
    // coordinates round to device pixels independently, which can leave a 1px seam (the level's
    // background color showing through) between them. Integer positions/spacing keep both
    // edges landing on the exact same pixel boundary.
    const originX = Math.round(this.x);
    const originY = Math.round(this.y);
    const image = this.scene.add.image(originX, originY, textureKey);
    this.setVisual(image);
    image.setScrollFactor((this.params.parallaxX ?? 0) / 100, (this.params.parallaxY ?? 0) / 100);

    const repeatCount = Math.max(1, Math.floor(this.params.repeatX ?? 1));
    // -1px overlap: belt-and-suspenders against any remaining sub-pixel bleed at the seam —
    // invisible here since neighboring tiles are mirror-symmetric at the edge they share.
    const tileWidth = Math.max(1, Math.round(image.displayWidth) - 1);
    let flip = image.flipX;
    for (let i = 1; i < repeatCount; i++) {
      flip = !flip;
      const tile = this.scene.add.image(originX - i * tileWidth, originY, textureKey);
      tile.setScale(image.scaleX, image.scaleY);
      tile.setAngle(image.angle);
      tile.setFlipX(flip);
      tile.setFlipY(image.flipY);
      tile.setScrollFactor(image.scrollFactorX, image.scrollFactorY);
      tile.setDepth(this.params.zIndex);
      tile.setVisible(!this.params.hidden);
      this.extraVisuals.push(tile);
    }
  }

  destroy(): void {
    for (const tile of this.extraVisuals) tile.destroy();
    this.extraVisuals.length = 0;
    super.destroy();
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('FixedBackground', (args) => new GEFixedBackground(args as any), {
  defaultParams: { zIndex: -50, behavior: 'background', image: 'paisaje.png', parallaxX: 0, parallaxY: 0, repeatX: 1 },
  paramSchema: [
    { key: 'image', label: 'Imagen', kind: 'select', default: 'paisaje.png', options: BACKGROUND_ASSETS },
    { key: 'parallaxX', label: 'Desviación X (%)', kind: 'number', default: 0 },
    { key: 'parallaxY', label: 'Desviación Y (%)', kind: 'number', default: 0 },
    { key: 'repeatX', label: 'Repeticiones horiz. (espejo)', kind: 'number', default: 1 },
  ],
  fixedToCamera: true,
});
