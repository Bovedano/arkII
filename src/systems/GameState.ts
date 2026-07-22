const STORAGE_KEY = 'super-t:save';

export interface PersistedState {
  unlockedSublevels: string[];
  unlockedAbilities: string[];
}

/**
 * Cross-scene state that must survive a scene restart: which sublevels/abilities are
 * unlocked. Persisted to localStorage, mirrored into the game's Data Manager (registry)
 * so any scene can read it reactively via `registry.get`/`changedata`.
 */
export class GameState {
  private state: PersistedState;

  constructor(private registry: Phaser.Data.DataManager) {
    this.state = GameState.load();
    this.registry.set('unlockedSublevels', [...this.state.unlockedSublevels]);
    this.registry.set('unlockedAbilities', [...this.state.unlockedAbilities]);
  }

  private static load(): PersistedState {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlockedSublevels: [], unlockedAbilities: [] };
    try {
      return JSON.parse(raw) as PersistedState;
    } catch {
      return { unlockedSublevels: [], unlockedAbilities: [] };
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  isSublevelUnlocked(id: string): boolean {
    return this.state.unlockedSublevels.includes(id);
  }

  unlockSublevel(id: string): void {
    if (this.state.unlockedSublevels.includes(id)) return;
    this.state.unlockedSublevels.push(id);
    this.registry.set('unlockedSublevels', [...this.state.unlockedSublevels]);
    this.save();
  }

  isAbilityUnlocked(id: string): boolean {
    return this.state.unlockedAbilities.includes(id);
  }

  unlockAbility(id: string): void {
    if (this.state.unlockedAbilities.includes(id)) return;
    this.state.unlockedAbilities.push(id);
    this.registry.set('unlockedAbilities', [...this.state.unlockedAbilities]);
    this.save();
  }
}

let instance: GameState | undefined;

/** Every scene shares the same underlying `registry` (it's Game-level, not per-scene),
 *  so this lazily creates GameState once and returns that same instance thereafter. */
export function getGameState(registry: Phaser.Data.DataManager): GameState {
  if (!instance) instance = new GameState(registry);
  return instance;
}
