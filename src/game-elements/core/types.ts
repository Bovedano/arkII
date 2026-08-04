/**
 * How an element participates in physics/collision:
 * - solid: blocks movement (collider).
 * - background: no collision (decorative).
 * - sensor: doesn't block but fires overlap — generalizes what GESwitch used to hardcode itself.
 * - damage: doesn't block; on player overlap costs a life and respawns them (see
 *   GameScene.wireBehaviorInteractions / handleLifeLoss).
 * - semisolid: one-way platform — blocks the player only when landing on top of it from
 *   above; jumping up through it from below passes through freely.
 *
 * Independent of `hidden` (rendering) — an element can be solid and hidden at the same time,
 * e.g. an invisible wall.
 */
export type GameElementBehavior = 'solid' | 'background' | 'sensor' | 'damage' | 'semisolid';

export interface GameElementParams {
  zIndex: number;
  behavior: GameElementBehavior;
  /** When true, not rendered. Independent of `behavior` — physics/collision are unaffected. */
  hidden?: boolean;
  /** Uniform visual scale. Applied generically by the Renderable mixin (see setVisual) —
   *  every type gets it for free, defaulted to 1 by GameElementRegistry.register(). */
  scale?: number;
  /** Rotation in degrees. Applied generically by the Renderable mixin (see setVisual) —
   *  every type gets it for free, defaulted to 0 by GameElementRegistry.register(). */
  rotation?: number;
  /** Horizontal mirror. Applied generically by the Renderable mixin (see setVisual) —
   *  every type gets it for free, defaulted to false by GameElementRegistry.register(). */
  flipX?: boolean;
  /** Vertical mirror. Applied generically by the Renderable mixin (see setVisual) —
   *  every type gets it for free, defaulted to false by GameElementRegistry.register(). */
  flipY?: boolean;
  [key: string]: unknown;
}

/** Describes one type-specific param field, for editor property-panel generation. */
export interface GameElementParamFieldSchema {
  key: string;
  label: string;
  kind: 'number' | 'string' | 'color' | 'boolean' | 'select';
  default: unknown;
  /** Fixed choices for kind: 'select'. */
  options?: string[];
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
