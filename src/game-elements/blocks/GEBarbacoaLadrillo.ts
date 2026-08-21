import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';
import { BARBACOA_LADRILLO_ANIM_KEY, BARBACOA_LADRILLO_ENCENDIDA_TEXTURE_KEYS } from '../../systems/animations';

export interface BarbacoaLadrilloParams extends GameElementParams {
  encendido?: boolean;
}

export class GEBarbacoaLadrillo extends Renderable(GameElement<BarbacoaLadrilloParams>) {
  readonly type = 'BarbacoaLadrillo';

  init(): void {
    const { encendido = false } = this.params;
    if (encendido) {
      const sprite = this.scene.add.sprite(this.x, this.y, BARBACOA_LADRILLO_ENCENDIDA_TEXTURE_KEYS[0]);
      this.setVisual(sprite);
      sprite.play(BARBACOA_LADRILLO_ANIM_KEY);
    } else {
      const image = this.scene.add.image(this.x, this.y, 'barbacoa-ladrillo');
      this.setVisual(image);
    }
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('BarbacoaLadrillo', (args) => new GEBarbacoaLadrillo(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background', encendido: false },
  paramSchema: [{ key: 'encendido', label: 'Encendido', kind: 'boolean', default: false }],
});
