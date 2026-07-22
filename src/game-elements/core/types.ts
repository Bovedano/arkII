/**
 * How an element participates in rendering/physics:
 * - solid: rendered, blocks movement (collider).
 * - background: rendered, no collision (decorative).
 * - hidden: not rendered, no collision (logic-only marker).
 * - sensor: rendered, doesn't block but fires overlap — generalizes what GESwitch
 *   used to hardcode itself.
 */
export type GameElementBehavior = 'solid' | 'background' | 'hidden' | 'sensor';

export interface GameElementParams {
  zIndex: number;
  behavior: GameElementBehavior;
  [key: string]: unknown;
}

/** Describes one type-specific param field, for editor property-panel generation. */
export interface GameElementParamFieldSchema {
  key: string;
  label: string;
  kind: 'number' | 'string' | 'color' | 'boolean';
  default: unknown;
}

/** Metadata a GameElement type registers alongside its factory, consumed by the level editor. */
export interface GameElementTypeMeta {
  defaultParams: GameElementParams;
  paramSchema: GameElementParamFieldSchema[];
}

export interface GameElementCtorArgs<P extends GameElementParams = GameElementParams> {
  scene: Phaser.Scene;
  id: string;
  x: number;
  y: number;
  params: P;
}

export type GameElementFactory = (args: GameElementCtorArgs) => GameElementLike;

// Kept as a loose structural type here to avoid a circular import with GameElement.ts;
// GameElement itself satisfies this shape.
export interface GameElementLike {
  readonly id: string;
  readonly type: string;
  init(): void;
  update?(time: number, delta: number): void;
  destroy(): void;
}

// `abstract new` (not plain `new`) so mixins can be applied directly to the abstract
// GameElement class itself, e.g. `class GEColorBlock extends PhysicsBody(Renderable(GameElement))`.
export type Constructor<T = object> = abstract new (...args: any[]) => T;
