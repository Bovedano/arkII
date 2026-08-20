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
  /** When true (and `behavior` is 'solid' or 'semisolid'), the player rides along with this
   *  element's own movement while standing on top of it — a moving platform. Wired generically
   *  by GameScene.tickCarriers(), defaulted to false by GameElementRegistry.register(). Has no
   *  effect on elements that never move (nothing to carry the player along with). */
  carry?: boolean;
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
  /** True for types that pin themselves to the camera (scrollFactor 0, e.g. FixedBackground) —
   *  their x/y are screen pixels (0..GAME_WIDTH, 0..GAME_HEIGHT), not level/world coordinates.
   *  The editor uses this to place new instances sensibly instead of dropping in world space,
   *  and to hint the property panel's X/Y fields. */
  fixedToCamera?: boolean;
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
  /** Optional secondary Phaser GameObjects a type creates beyond its primary `visual` (e.g.
   *  GEFixedBackground's mirrored repeat tiles). The level editor adds these to its own preview
   *  container too, so they render under its pan/zoom/mask exactly like `visual` does — a type
   *  that creates extra GameObjects via `scene.add.*` directly and leaves them off this list
   *  will render them in raw scene coordinates in the editor (wrong position, unclipped),
   *  even though they're correct in real gameplay (which has no such container). */
  readonly extraVisuals?: (Phaser.GameObjects.GameObject & { x: number; y: number })[];
}

// `abstract new` (not plain `new`) so mixins can be applied directly to the abstract
// GameElement class itself, e.g. `class GEColorBlock extends PhysicsBody(Renderable(GameElement))`.
export type Constructor<T = object> = abstract new (...args: any[]) => T;
