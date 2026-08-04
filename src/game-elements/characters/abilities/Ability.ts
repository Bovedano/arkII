import type { GEPenista } from '../GEPenista';

export interface AbilityContext {
  character: GEPenista;
  scene: Phaser.Scene;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  /** Generic virtual key (bound to Space) — no ability consumes it yet, reserved for a
   *  future interact/attack ability and for the touch "action" button. */
  actionKey: Phaser.Input.Keyboard.Key;
}

/**
 * A single movement/action capability a character can have active. New abilities are
 * added by implementing this and registering with AbilityRegistry — GEPenista never
 * needs to change to support one.
 */
export abstract class Ability {
  abstract readonly id: string;
  protected ctx!: AbilityContext;

  /** Called once when attached (at spawn, or mid-game on unlock). Register input listeners here. */
  attach(ctx: AbilityContext): void {
    this.ctx = ctx;
  }

  /** Called once when detached. Undo whatever attach() set up. */
  detach(): void {}

  /** Polled every frame by GEPenista.update() — keep allocation-free. */
  update(_time: number, _delta: number): void {}
}
