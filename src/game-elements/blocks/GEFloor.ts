import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { PhysicsBody } from '../core/mixins/PhysicsBody';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';
import { FLOOR_THEMES, type FloorTheme } from '../../config/floorThemes';

const TILE_SIZE = 64;
const DEFAULT_BASECOLOR = '#4a3728';

export interface FloorParams extends GameElementParams {
  centerCount: number;
  theme: FloorTheme;
  height: number;
}

/**
 * A solid floor strip: a left tile, N center tiles, a right tile (64px each), and — when
 * `height` exceeds one tile — a filler rectangle below using the theme's manifest basecolor.
 * One static Arcade body spans the whole strip.
 *
 * `x`/`y` is the strip's CENTER, not its top-left corner like GEColorBlock. Phaser hardcodes
 * Container.originX/originY to 0.5 ("Internal value to allow Containers to be used for input
 * and physics ... do not change", see Container.js), so every consumer that reads a visual's
 * origin to place it — Arcade's static body, the level editor's selection box and resize
 * handles (EditorCanvas.localBounds) — already assumes a Container-based visual is centered on
 * its x/y. Anchoring the tiles to that center instead of fighting Phaser's assumption keeps all
 * of those correct for free, instead of patching each call site that reads originX/Y.
 */
export class GEFloor extends PhysicsBody(Renderable(GameElement<FloorParams>)) {
  readonly type = 'Floor';

  init(): void {
    const { theme } = this.params;
    const centerCount = Math.max(0, Math.floor(this.params.centerCount ?? 0));
    const height = Math.max(TILE_SIZE, Math.floor(this.params.height ?? TILE_SIZE));
    const width = (centerCount + 2) * TILE_SIZE;
    const left = -width / 2;
    const top = -height / 2;

    const container = this.scene.add.container(this.x, this.y);

    container.add(this.scene.add.image(left, top, `floor-${theme}-left`).setOrigin(0, 0));
    for (let i = 0; i < centerCount; i++) {
      container.add(
        this.scene.add.image(left + (i + 1) * TILE_SIZE, top, `floor-${theme}-center`).setOrigin(0, 0),
      );
    }
    container.add(
      this.scene.add.image(left + (centerCount + 1) * TILE_SIZE, top, `floor-${theme}-right`).setOrigin(0, 0),
    );

    const fillerHeight = height - TILE_SIZE;
    if (fillerHeight > 0) {
      const manifest = this.scene.cache.json.get(`floor-${theme}-manifest`) as { basecolor?: string } | undefined;
      const basecolor = manifest?.basecolor ?? DEFAULT_BASECOLOR;
      const filler = this.scene.add
        .rectangle(left, top + TILE_SIZE, width, fillerHeight, Phaser.Display.Color.HexStringToColor(basecolor).color)
        .setOrigin(0, 0);
      container.add(filler);
    }

    // Container width/height default to 0 — Arcade's static body reads them, so this must be
    // set before enablePhysics() or the collider ends up sized 0x0.
    container.setSize(width, height);
    this.setVisual(container);
    this.enablePhysics({ static: true });
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('Floor', (args) => new GEFloor(args as any), {
  defaultParams: { centerCount: 1, theme: 'brown', height: TILE_SIZE, zIndex: 0, behavior: 'solid' },
  paramSchema: [
    { key: 'centerCount', label: 'Bloques centrales', kind: 'number', default: 1 },
    { key: 'height', label: 'Alto', kind: 'number', default: TILE_SIZE },
    { key: 'theme', label: 'Tema', kind: 'select', default: 'brown', options: [...FLOOR_THEMES] },
  ],
});
