import { GameElement } from '../GameElement';
import type { Constructor } from '../types';

type WithVisual = GameElement & { visual: Phaser.GameObjects.GameObject };

/**
 * Adds an Arcade Physics body to whatever `visual` the Renderable mixin set up.
 * Must be applied on top of Renderable: `PhysicsBody(Renderable(GameElement))`.
 *
 * If the visual was already created via `scene.physics.add.sprite(...)` (which enables
 * physics itself), skip calling `enablePhysics()` — see GEPenista for that case.
 */
export function PhysicsBody<TBase extends Constructor<WithVisual>>(Base: TBase) {
  abstract class PhysicsBodyElement extends Base {
    get body(): Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody {
      return (this.visual as unknown as { body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody }).body;
    }

    /**
     * Adds an Arcade body, unless `behavior` says this element has no physical presence
     * (`background`). `sensor` still gets a body (always static) — it's meant for overlap
     * detection, never for blocking movement — regardless of the caller's `static` option.
     * Unaffected by `hidden` — a hidden element can still be solid (e.g. an invisible wall).
     */
    enablePhysics(options: { static: boolean } = { static: false }): void {
      const { behavior } = this.params;
      if (behavior === 'background') return;
      const isStatic = behavior === 'sensor' ? true : options.static;
      this.scene.physics.add.existing(this.visual as Phaser.Types.Physics.Arcade.GameObjectWithBody, isStatic);
    }

    /**
     * Shrinks/repositions the Arcade body (dynamic or static) relative to the visual's full
     * frame — for sprites whose texture has transparent padding around the actual silhouette,
     * so collisions match what's drawn instead of the whole frame rectangle.
     */
    setBodyBox(width: number, height: number, offsetX: number, offsetY: number): void {
      this.body.setSize(width, height).setOffset(offsetX, offsetY);
    }
  }
  return PhysicsBodyElement;
}
