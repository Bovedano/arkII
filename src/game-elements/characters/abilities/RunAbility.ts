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

    // Keep the sprite's facing in sync every frame, grounded or airborne. syncAnim() only
    // switches when the key actually changes, so it corrects the texture the instant the
    // player reverses direction (including mid-jump) without restarting the already-finished
    // jump animation from frame 0 every tick — that restart looked like flickering.
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
      character.syncAnim(key);
    } else if (grounded) {
      // No direction held and standing on solid ground: stop the run loop and hold a
      // static pose instead of letting the last animation (repeat: -1) keep looping.
      character.showIdle();
    }
  }
}

AbilityRegistry.register('run', () => new RunAbility());
