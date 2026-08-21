import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type VallaTroncosParams = GameElementParams;

export class GEVallaTroncos extends Renderable(GameElement<VallaTroncosParams>) {
  readonly type = 'VallaTroncos';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, 'valla-troncos');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('VallaTroncos', (args) => new GEVallaTroncos(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
