import type { GameElement } from '../game-elements/core/GameElement';
import { GameElementRegistry } from '../game-elements/core/registry';
import { resolveGroupInstance } from '../levels/groupInstance';
import type { LevelDefinition } from '../levels/types';

export class LevelLoader {
  /** Below any element's zIndex (which starts at 0), so the background image always renders
   *  behind the level. */
  private static readonly BACKGROUND_DEPTH = -1000;

  /** Parses the level's plain-text (JSON) representation. Throws on malformed text — the
   *  caller (GameScene) is expected to let that surface rather than silently swallow it. */
  static parse(jsonText: string): LevelDefinition {
    return JSON.parse(jsonText) as LevelDefinition;
  }

  /**
   * Builds the scene's world (bounds/gravity/background) and instantiates every element.
   * Called once from GameScene.create() — never from update().
   */
  static instantiate(scene: Phaser.Scene, level: LevelDefinition): GameElement[] {
    scene.physics.world.setBounds(0, 0, level.config.width, level.config.height);
    scene.physics.world.gravity.y = level.config.gravity;
    scene.cameras.main.setBackgroundColor(level.config.background);
    scene.cameras.main.setBounds(0, 0, level.config.width, level.config.height);
    LevelLoader.createBackgroundImage(scene, level);

    const elements: GameElement[] = [];
    level.elements.forEach((def, index) => {
      const element = GameElementRegistry.create(def.type, {
        scene,
        id: def.id ?? `${def.type}-${index}`,
        x: def.x,
        y: def.y,
        params: def.params,
      }) as GameElement;
      element.init();
      elements.push(element);
    });

    (level.groupInstances ?? []).forEach((instance) => {
      const resolved = resolveGroupInstance(level, instance);
      if (!resolved) return; // orphaned instance (group deleted) — skip, don't crash the level
      for (const { id, def } of resolved) {
        const element = GameElementRegistry.create(def.type, {
          scene,
          id,
          x: def.x,
          y: def.y,
          params: def.params,
        }) as GameElement;
        element.init();
        elements.push(element);
      }
    });

    return elements;
  }

  /** Adds the level's optional decorative background image, sized to keep covering the camera
   *  viewport across its whole scroll range even though a parallax `scrollFactor` < 1 makes it
   *  move slower than the world — otherwise the level's true edges would peek through as gaps
   *  once the camera nears them. */
  private static createBackgroundImage(scene: Phaser.Scene, level: LevelDefinition): void {
    const bg = level.config.backgroundImage;
    if (!bg) return;

    const { width, height } = level.config;
    const scrollFactorX = (bg.parallaxX ?? 100) / 100;
    const scrollFactorY = (bg.parallaxY ?? 100) / 100;

    const viewport = scene.cameras.main;
    const maxScrollX = Math.max(0, width - viewport.width);
    const maxScrollY = Math.max(0, height - viewport.height);
    const displayWidth = width + 2 * maxScrollX * (1 - scrollFactorX);
    const displayHeight = height + 2 * maxScrollY * (1 - scrollFactorY);

    scene.add
      .image(width / 2, height / 2, bg.image)
      .setDisplaySize(displayWidth, displayHeight)
      .setScrollFactor(scrollFactorX, scrollFactorY)
      .setDepth(LevelLoader.BACKGROUND_DEPTH);
  }
}
