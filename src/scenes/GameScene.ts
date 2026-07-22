import Phaser from 'phaser';
import { LevelLoader } from '../systems/LevelLoader';
import { getLevelText } from '../levels/levelRegistry';
import { getGameState } from '../systems/GameState';
import { EventBus } from '../systems/EventBus';
import type { GameElementLike } from '../game-elements/core/types';
import type { LevelDefinition } from '../levels/types';
import { GEPenista } from '../game-elements/characters/GEPenista';

interface WithVisualAndParams extends GameElementLike {
  visual: Phaser.GameObjects.GameObject;
  params: { behavior?: string };
  trigger?: () => void;
}

interface GameSceneData {
  levelId: string;
}

export class GameScene extends Phaser.Scene {
  private levelId!: string;
  private level!: LevelDefinition;
  private elements: GameElementLike[] = [];
  private levelEventHandler = (eventKey: string) => this.onLevelEvent(eventKey);

  constructor() {
    super('Game');
  }

  init(data: GameSceneData): void {
    this.levelId = data.levelId;
  }

  create(): void {
    this.elements = [];
    this.level = LevelLoader.parse(getLevelText(this.levelId));
    this.elements = LevelLoader.instantiate(this, this.level);

    const player = this.elements.find((el): el is GEPenista => el instanceof GEPenista);
    if (player) {
      this.cameras.main.startFollow(player.visual, true);
      this.wireBehaviorInteractions(player);
    }

    EventBus.on('level-event', this.levelEventHandler);
    this.events.once('shutdown', () => EventBus.off('level-event', this.levelEventHandler));

    this.input.keyboard?.once('keydown-ESC', () => this.scene.start('LevelSelect'));
  }

  update(time: number, delta: number): void {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].update?.(time, delta);
    }
  }

  /** Wires collision/overlap between the player and every other element, driven by `behavior`. */
  private wireBehaviorInteractions(player: GEPenista): void {
    for (const el of this.elements) {
      if (el === player) continue;
      const withVisual = el as unknown as WithVisualAndParams;
      if (!withVisual.visual) continue;
      const behavior = withVisual.params?.behavior;
      if (behavior === 'solid') {
        this.physics.add.collider(player.visual, withVisual.visual);
      } else if (behavior === 'sensor') {
        this.physics.add.overlap(player.visual, withVisual.visual, () => withVisual.trigger?.());
      }
    }
  }

  private onLevelEvent(eventKey: string): void {
    const gameState = getGameState(this.registry);
    for (const sub of this.level.sublevels ?? []) {
      if (sub.unlockOn === eventKey) gameState.unlockSublevel(sub.id);
    }
  }
}
