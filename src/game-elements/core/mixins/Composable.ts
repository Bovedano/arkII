import { GameElement } from '../GameElement';
import type { Constructor, GameElementLike } from '../types';

/**
 * Lets a GameElement be built out of other GameElements (composition), as an alternative
 * to subclassing. e.g. GESwitch = a visual block child + a trigger-zone child, without
 * either needing multiple inheritance.
 */
export function Composable<TBase extends Constructor<GameElement>>(Base: TBase) {
  abstract class ComposableElement extends Base {
    children: GameElementLike[] = [];

    addChild(el: GameElementLike): void {
      this.children.push(el);
    }

    removeChild(id: string): void {
      const idx = this.children.findIndex((c) => c.id === id);
      if (idx !== -1) this.children.splice(idx, 1);
    }

    init(): void {
      super.init();
      for (const child of this.children) child.init();
    }

    update(time: number, delta: number): void {
      for (const child of this.children) child.update?.(time, delta);
    }

    destroy(): void {
      for (const child of this.children) child.destroy();
      this.children = [];
      super.destroy();
    }
  }
  return ComposableElement;
}
