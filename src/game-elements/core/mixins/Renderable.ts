import { GameElement } from '../GameElement';
import type { Constructor } from '../types';

/** Adds a single visual GameObject (sprite, rectangle, etc.) to a GameElement. */
export function Renderable<TBase extends Constructor<GameElement>>(Base: TBase) {
  abstract class RenderableElement extends Base {
    visual!: Phaser.GameObjects.GameObject & { x: number; y: number };

    /** Store a GameObject already created via `scene.add.*` (which already adds it to the display list). */
    setVisual<T extends Phaser.GameObjects.GameObject & { x: number; y: number }>(obj: T): T {
      this.visual = obj;
      const depthable = obj as unknown as {
        setDepth?: (d: number) => unknown;
        setVisible?: (v: boolean) => unknown;
        setScale?: (s: number) => unknown;
        setAngle?: (a: number) => unknown;
        setFlipX?: (f: boolean) => unknown;
        setFlipY?: (f: boolean) => unknown;
      };
      depthable.setDepth?.(this.params.zIndex);
      depthable.setVisible?.(!this.params.hidden);
      // Optional generic resize handle: types that opt in via a `scale` param (see paramSchema)
      // get it applied here, before enablePhysics() runs, so an Arcade body created afterwards
      // already picks up the scaled displayWidth/displayHeight (Phaser sizes new bodies from
      // the GameObject's display size at creation time).
      const scale = this.params.scale;
      if (typeof scale === 'number') depthable.setScale?.(scale);
      // Rotation + mirroring, generic for every type. `setFlipX`/`setFlipY` only exist on
      // texture-based objects (Sprite/Image) — shapes like Rectangle simply don't have them,
      // hence the `?.` guard (harmless no-op, and mirroring a flat color is a no-op anyway).
      const rotation = this.params.rotation;
      if (typeof rotation === 'number') depthable.setAngle?.(rotation);
      const flipX = this.params.flipX;
      if (typeof flipX === 'boolean') depthable.setFlipX?.(flipX);
      const flipY = this.params.flipY;
      if (typeof flipY === 'boolean') depthable.setFlipY?.(flipY);
      return obj;
    }

    destroy(): void {
      this.visual?.destroy();
      super.destroy();
    }
  }
  return RenderableElement;
}
