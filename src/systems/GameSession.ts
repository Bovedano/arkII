import type { LevelDefinition } from '../levels/types';

export interface HudSnapshot {
  lives: number;
  maxLives: number;
  collected: number;
  total: number;
  timeRemainingSec: number;
}

/**
 * Per-attempt game state (lives, collectibles, countdown) — resets every time GameScene is
 * created. Deliberately separate from GameState, which persists unlocks across attempts.
 */
export class GameSession {
  readonly maxLives = 3;
  lives = this.maxLives;
  collected = 0;
  readonly total: number;
  private readonly timeLimitSec: number;
  timeRemainingSec: number;
  /** Total time spent in this attempt, independent of the countdown — not reset by
   *  loseLife(), so it keeps accumulating across respawns until the level is completed. */
  elapsedSec = 0;

  constructor(level: LevelDefinition) {
    this.total = level.elements.filter((el) => el.type === 'CervezaEstrella').length;
    this.timeLimitSec = level.config.timeLimitSec ?? 300;
    this.timeRemainingSec = this.timeLimitSec;
  }

  collect(): void {
    this.collected++;
  }

  /** Advances the clock; returns true only on the exact frame it reaches 0. */
  tick(deltaMs: number): boolean {
    this.elapsedSec += deltaMs / 1000;
    if (this.timeRemainingSec <= 0) return false;
    this.timeRemainingSec = Math.max(0, this.timeRemainingSec - deltaMs / 1000);
    return this.timeRemainingSec === 0;
  }

  /** Subtracts a life. Returns true if that was the last life. */
  loseLife(): boolean {
    this.lives--;
    return this.lives <= 0;
  }

  snapshot(): HudSnapshot {
    return {
      lives: this.lives,
      maxLives: this.maxLives,
      collected: this.collected,
      total: this.total,
      timeRemainingSec: Math.ceil(this.timeRemainingSec),
    };
  }
}
