import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';
import { AGUA_RIO_ANIM_KEY, AGUA_RIO_TEXTURE_KEYS } from '../../systems/animations';

export type AguaRioParams = GameElementParams;

export class GEAguaRio extends Renderable(GameElement<AguaRioParams>) {
  readonly type = 'AguaRio';

  init(): void {
    const sprite = this.scene.add.sprite(this.x, this.y, AGUA_RIO_TEXTURE_KEYS[0]);
    this.setVisual(sprite);
    sprite.play(AGUA_RIO_ANIM_KEY);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('AguaRio', (args) => new GEAguaRio(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
