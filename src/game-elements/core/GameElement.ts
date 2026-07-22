import type { GameElementCtorArgs, GameElementParams } from './types';

/**
 * Common base for every GameElement. Deliberately thin — capabilities (rendering,
 * physics, events, composition) are added via mixins in ./mixins, not baked in here,
 * so a concrete element only pulls in what it actually needs.
 */
export abstract class GameElement<P extends GameElementParams = GameElementParams> {
  readonly scene: Phaser.Scene;
  readonly id: string;
  abstract readonly type: string;
  x: number;
  y: number;
  readonly params: P;

  constructor(args: GameElementCtorArgs<P>) {
    this.scene = args.scene;
    this.id = args.id;
    this.x = args.x;
    this.y = args.y;
    this.params = args.params;
  }

  /**
   * Real construction (sprites, bodies, listeners) happens here, not in the constructor,
   * so mixin setup order is deterministic and doesn't depend on `super()` call ordering.
   * Base implementation is an empty no-op (not abstract) so mixins like Composable can
   * safely call `super.init()` regardless of where they sit in the mixin chain.
   */
  init(): void {}

  /**
   * Per-frame hook. Deliberately NOT declared here (not even as optional) — elements that
   * need one just add their own `update(time, delta)` method. `GameElementLike` (types.ts)
   * declares it as optional for code that iterates over elements generically.
   */

  /** Teardown. Mixins override this and call super.destroy() to chain cleanup. */
  destroy(): void {}
}
