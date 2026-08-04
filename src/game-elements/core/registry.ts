import type { GameElementCtorArgs, GameElementFactory, GameElementTypeMeta } from './types';

class GameElementRegistryImpl {
  private factories = new Map<string, GameElementFactory>();
  private metas = new Map<string, GameElementTypeMeta>();

  register(type: string, factory: GameElementFactory, meta: GameElementTypeMeta): void {
    if (this.factories.has(type)) {
      throw new Error(`GameElement type "${type}" is already registered`);
    }
    this.factories.set(type, factory);
    // `scale`/`rotation`/`flipX`/`flipY` are universal (see GameElementParams) — default them
    // here instead of every call site, so every type gets them without repeating the field
    // declaration.
    this.metas.set(type, {
      ...meta,
      defaultParams: { scale: 1, rotation: 0, flipX: false, flipY: false, ...meta.defaultParams },
    });
  }

  create(type: string, args: GameElementCtorArgs) {
    const factory = this.factories.get(type);
    if (!factory) {
      throw new Error(`Unknown GameElement type "${type}". Is it imported in game-elements/registerAll.ts?`);
    }
    return factory(args);
  }

  /** Enumerates every registered type + its metadata — used by the level editor's palette. */
  list(): { type: string; meta: GameElementTypeMeta }[] {
    return Array.from(this.metas.entries()).map(([type, meta]) => ({ type, meta }));
  }

  getMeta(type: string): GameElementTypeMeta {
    const meta = this.metas.get(type);
    if (!meta) throw new Error(`Unknown GameElement type "${type}"`);
    return meta;
  }
}

export const GameElementRegistry = new GameElementRegistryImpl();
