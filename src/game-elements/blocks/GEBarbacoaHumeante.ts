import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';
import { BARBACOA_HUMEANTE_ANIM_KEY, BARBACOA_HUMEANTE_TEXTURE_KEYS } from '../../systems/animations';

export type BarbacoaHumeanteParams = GameElementParams;

export class GEBarbacoaHumeante extends Renderable(GameElement<BarbacoaHumeanteParams>) {
  readonly type = 'BarbacoaHumeante';

  init(): void {
    const sprite = this.scene.add.sprite(this.x, this.y, BARBACOA_HUMEANTE_TEXTURE_KEYS[0]);
    this.setVisual(sprite);
    sprite.play(BARBACOA_HUMEANTE_ANIM_KEY);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('BarbacoaHumeante', (args) => new GEBarbacoaHumeante(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
