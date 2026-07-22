import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { PhysicsBody } from '../core/mixins/PhysicsBody';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export interface ColorBlockParams extends GameElementParams {
  width: number;
  height: number;
  color: string; // hex string, e.g. "#4a3728"
}

/**
 * A solid, static block: a colored rectangle with an Arcade Physics static body.
 * Placeholder rendering until real tile art exists — future block art gets its own
 * sibling GameElement (e.g. GETileBlock) rather than retrofitting this one.
 */
export class GEColorBlock extends PhysicsBody(Renderable(GameElement<ColorBlockParams>)) {
  readonly type = 'ColorBlock';

  init(): void {
    const { width, height, color } = this.params;
    const rect = this.scene.add.rectangle(
      this.x,
      this.y,
      width,
      height,
      Phaser.Display.Color.HexStringToColor(color).color,
    );
    // Origin (0,0): level JSON x/y read as "top-left corner + size" for blocks.
    rect.setOrigin(0, 0);
    this.setVisual(rect);
    this.enablePhysics({ static: true });
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('ColorBlock', (args) => new GEColorBlock(args as any), {
  defaultParams: { width: 200, height: 40, color: '#4a3728', zIndex: 0, behavior: 'solid' },
  paramSchema: [
    { key: 'width', label: 'Ancho', kind: 'number', default: 200 },
    { key: 'height', label: 'Alto', kind: 'number', default: 40 },
    { key: 'color', label: 'Color', kind: 'color', default: '#4a3728' },
  ],
});
