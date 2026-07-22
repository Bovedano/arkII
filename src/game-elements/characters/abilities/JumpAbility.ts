import Phaser from 'phaser';
import { Ability } from './Ability';
import { AbilityRegistry } from './AbilityRegistry';
import { PENISTA_ANIM_KEYS } from '../../../systems/animations';

export class JumpAbility extends Ability {
  readonly id = 'jump';
  private jumpSpeed = -400;

  update(): void {
    const { character, cursors } = this.ctx;
    if (character.isGrounded() && Phaser.Input.Keyboard.JustDown(cursors.up)) {
      character.setVelocityY(this.jumpSpeed);
      character.play(character.facing === 'east' ? PENISTA_ANIM_KEYS.jumpEast : PENISTA_ANIM_KEYS.jumpWest);
    }
  }
}

AbilityRegistry.register('jump', () => new JumpAbility());
