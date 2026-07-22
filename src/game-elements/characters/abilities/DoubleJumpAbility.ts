import Phaser from 'phaser';
import { Ability } from './Ability';
import { AbilityRegistry } from './AbilityRegistry';

/**
 * Minimal example of a mid-game-unlockable ability: an extra jump usable once per
 * airborne stretch. Unlocked the same way any ability is — see GEPenista's
 * 'ability:unlock' EventBus listener and GameState.unlockAbility.
 */
export class DoubleJumpAbility extends Ability {
  readonly id = 'doubleJump';
  private extraJumpSpeed = -350;
  private usedExtraJump = false;

  update(): void {
    const { character, cursors } = this.ctx;
    if (character.isGrounded()) {
      this.usedExtraJump = false;
      return;
    }
    if (!this.usedExtraJump && Phaser.Input.Keyboard.JustDown(cursors.up)) {
      character.setVelocityY(this.extraJumpSpeed);
      this.usedExtraJump = true;
    }
  }
}

AbilityRegistry.register('doubleJump', () => new DoubleJumpAbility());
