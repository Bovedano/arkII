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
    if (this.timeRemainingSec <= 0) return false;
    this.timeRemainingSec = Math.max(0, this.timeRemainingSec - deltaMs / 1000);
    return this.timeRemainingSec === 0;
  }

  /** Subtracts a life and resets the clock. Returns true if that was the last life. */
  loseLife(): boolean {
    this.lives--;
    this.timeRemainingSec = this.timeLimitSec;
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
