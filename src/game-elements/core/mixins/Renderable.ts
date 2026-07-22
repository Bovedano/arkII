import { GameElement } from '../GameElement';
import type { Constructor } from '../types';

/** Adds a single visual GameObject (sprite, rectangle, etc.) to a GameElement. */
export function Renderable<TBase extends Constructor<GameElement>>(Base: TBase) {
  abstract class RenderableElement extends Base {
    visual!: Phaser.GameObjects.GameObject & { x: number; y: number };

    /** Store a GameObject already created via `scene.add.*` (which already adds it to the display list). */
    setVisual<T extends Phaser.GameObjects.GameObject & { x: number; y: number }>(obj: T): T {
      this.visual = obj;
      const depthable = obj as unknown as { setDepth?: (d: number) => unknown; setVisible?: (v: boolean) => unknown };
      depthable.setDepth?.(this.params.zIndex);
      depthable.setVisible?.(this.params.behavior !== 'hidden');
      return obj;
    }

    destroy(): void {
      this.visual?.destroy();
      super.destroy();
    }
  }
  return RenderableElement;
}
