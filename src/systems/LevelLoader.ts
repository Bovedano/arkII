import type { GameElement } from '../game-elements/core/GameElement';
import { GameElementRegistry } from '../game-elements/core/registry';
import type { LevelDefinition } from '../levels/types';

export class LevelLoader {
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
    return elements;
  }
}
