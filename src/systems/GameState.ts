const STORAGE_KEY = 'super-t:save';

export interface PersistedState {
  unlockedSublevels: string[];
  unlockedAbilities: string[];
  /** levelId -> best completion time in seconds. */
  completedLevels: Record<string, number>;
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
    this.registry.set('completedLevels', { ...this.state.completedLevels });
  }

  private static load(): PersistedState {
    const empty = (): PersistedState => ({ unlockedSublevels: [], unlockedAbilities: [], completedLevels: {} });
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    try {
      // Spread over `empty()` so saves written before completedLevels existed still parse.
      return { ...empty(), ...(JSON.parse(raw) as Partial<PersistedState>) };
    } catch {
      return empty();
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

  isLevelCompleted(id: string): boolean {
    return id in this.state.completedLevels;
  }

  getBestTimeSec(id: string): number | undefined {
    return this.state.completedLevels[id];
  }

  /** Records a level completion. Only persists when it's the first completion or an
   *  improvement over the existing best time; either way returns the resulting best. */
  recordCompletion(id: string, timeSec: number): { isNewRecord: boolean; bestTimeSec: number } {
    const previous = this.state.completedLevels[id];
    const isNewRecord = previous === undefined || timeSec < previous;
    if (isNewRecord) {
      this.state.completedLevels[id] = timeSec;
      this.registry.set('completedLevels', { ...this.state.completedLevels });
      this.save();
    }
    return { isNewRecord, bestTimeSec: isNewRecord ? timeSec : previous };
  }
}

let instance: GameState | undefined;

/** Every scene shares the same underlying `registry` (it's Game-level, not per-scene),
 *  so this lazily creates GameState once and returns that same instance thereafter. */
export function getGameState(registry: Phaser.Data.DataManager): GameState {
  if (!instance) instance = new GameState(registry);
  return instance;
}
