import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

const COLORS = ['blanco', 'negro'] as const;
type CocheSeatIbizaColor = (typeof COLORS)[number];

export interface CocheSeatIbizaParams extends GameElementParams {
  color: CocheSeatIbizaColor;
}

export class GECocheSeatIbiza extends Renderable(GameElement<CocheSeatIbizaParams>) {
  readonly type = 'CocheSeatIbiza';

  init(): void {
    const { color = 'blanco' } = this.params;
    const image = this.scene.add.image(this.x, this.y, `coche-seat-ibiza-${color}`);
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('CocheSeatIbiza', (args) => new GECocheSeatIbiza(args as any), {
  defaultParams: { color: 'blanco', zIndex: 5, behavior: 'background' },
  paramSchema: [{ key: 'color', label: 'Color', kind: 'select', default: 'blanco', options: [...COLORS] }],
});
