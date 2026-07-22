import { Ability } from './Ability';
import { AbilityRegistry } from './AbilityRegistry';
import { PENISTA_ANIM_KEYS } from '../../../systems/animations';

export class RunAbility extends Ability {
  readonly id = 'run';
  private speed = 200;

  update(): void {
    const { character, cursors } = this.ctx;
    if (cursors.left.isDown) {
      character.setVelocityX(-this.speed);
      character.facing = 'west';
    } else if (cursors.right.isDown) {
      character.setVelocityX(this.speed);
      character.facing = 'east';
    } else {
      character.setVelocityX(0);
    }

    // Keep the sprite's facing in sync every frame, grounded or airborne — GEPenista.play()
    // is a no-op if that exact animation is already playing, so this doesn't restart
    // anything, it just corrects the texture the instant the player reverses direction
    // (including mid-jump, which used to only update `facing` without re-playing).
    const grounded = character.isGrounded();
    if (cursors.left.isDown || cursors.right.isDown) {
      const key =
        character.facing === 'east'
          ? grounded
            ? PENISTA_ANIM_KEYS.runEast
            : PENISTA_ANIM_KEYS.jumpEast
          : grounded
            ? PENISTA_ANIM_KEYS.runWest
            : PENISTA_ANIM_KEYS.jumpWest;
      character.play(key);
    } else if (grounded) {
      // No direction held and standing on solid ground: stop the run loop and hold a
      // static pose instead of letting the last animation (repeat: -1) keep looping.
      character.showIdle();
    }
  }
}

AbilityRegistry.register('run', () => new RunAbility());
