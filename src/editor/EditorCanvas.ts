import Phaser from 'phaser';
import { GameElementRegistry } from '../game-elements/core/registry';
import type { GameElement } from '../game-elements/core/GameElement';
import type { EditorState } from './EditorState';

export interface ViewportRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

type VisualLike = Phaser.GameObjects.GameObject & {
  x: number;
  y: number;
  width?: number;
  height?: number;
  displayWidth?: number;
  displayHeight?: number;
  setInteractive: (config?: unknown) => VisualLike;
  setVisible?: (v: boolean) => unknown;
  setAlpha?: (a: number) => unknown;
  on: (event: string, handler: (...args: unknown[]) => void) => unknown;
};

type EditorElement = GameElement & { visual: VisualLike };

/**
 * Renders the level being edited inside a fixed screen viewport, reusing the same
 * GameElementRegistry.create()+init() path GameScene/LevelLoader use for real gameplay,
 * so the editor always looks exactly like the game. Physics stays enabled (so bodies match
 * `behavior`) but paused, so nothing simulates while editing.
 */
export class EditorCanvas {
  private scene: Phaser.Scene;
  private state: EditorState;
  private rect: ViewportRect;
  private container: Phaser.GameObjects.Container;
  private selectionBox: Phaser.GameObjects.Rectangle;
  private instances: EditorElement[] = [];
  private scale = 1;

  constructor(scene: Phaser.Scene, state: EditorState, rect: ViewportRect) {
    this.scene = scene;
    this.state = state;
    this.rect = rect;

    scene.add.rectangle(rect.x, rect.y, rect.width, rect.height, 0x000000, 0).setOrigin(0, 0).setStrokeStyle(2, 0x555555);

    this.container = scene.add.container(rect.x, rect.y);
    this.selectionBox = scene.add
      .rectangle(0, 0, 10, 10, 0x000000, 0)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0xffd24a)
      .setVisible(false);
    this.container.add(this.selectionBox);

    state.onChange(() => this.render());
    this.render();
  }

  /** Converts a screen-space point (e.g. pointer.x/y) into level-space coordinates. */
  screenToLevel(screenX: number, screenY: number): { x: number; y: number } {
    return { x: (screenX - this.rect.x) / this.scale, y: (screenY - this.rect.y) / this.scale };
  }

  containsScreenPoint(x: number, y: number): boolean {
    return (
      x >= this.rect.x && x <= this.rect.x + this.rect.width && y >= this.rect.y && y <= this.rect.y + this.rect.height
    );
  }

  private render(): void {
    for (const instance of this.instances) instance.destroy();
    this.instances = [];

    const { width, height } = this.state.level.config;
    this.scale = Math.min(this.rect.width / width, this.rect.height / height, 1);
    this.container.setScale(this.scale);

    this.state.level.elements.forEach((def, index) => {
      const instance = GameElementRegistry.create(def.type, {
        scene: this.scene,
        id: def.id ?? `${def.type}-${index}`,
        x: def.x,
        y: def.y,
        params: def.params,
      }) as unknown as EditorElement;
      instance.init();

      // Editor-only affordance: show hidden markers faintly so they stay selectable/movable —
      // the exported JSON still carries the real `hidden` behavior for actual gameplay.
      if (def.params.behavior === 'hidden') {
        instance.visual.setVisible?.(true);
        instance.visual.setAlpha?.(0.35);
      }

      this.container.add(instance.visual);
      this.instances.push(instance);

      instance.visual.setInteractive({ useHandCursor: true });
      this.scene.input.setDraggable(instance.visual as unknown as Phaser.GameObjects.GameObject);
      instance.visual.on('pointerdown', () => this.select(index));
      instance.visual.on('drag', (...args: unknown[]) => {
        const [, dragX, dragY] = args as [Phaser.Input.Pointer, number, number];
        instance.visual.x = dragX;
        instance.visual.y = dragY;
        this.updateSelectionBox();
      });
      instance.visual.on('dragend', () => {
        this.state.moveElement(index, instance.visual.x, instance.visual.y);
      });
    });

    this.container.sort('depth');
    this.container.bringToTop(this.selectionBox);
    this.updateSelectionBox();

    this.scene.physics.world.pause();
  }

  private select(index: number): void {
    this.state.select(index);
  }

  private updateSelectionBox(): void {
    const index = this.state.selectedIndex;
    const instance = index !== null ? this.instances[index] : undefined;
    if (index === null || !instance) {
      this.selectionBox.setVisible(false);
      return;
    }
    const w = instance.visual.displayWidth ?? instance.visual.width ?? 32;
    const h = instance.visual.displayHeight ?? instance.visual.height ?? 32;
    this.selectionBox.setPosition(instance.visual.x, instance.visual.y);
    this.selectionBox.setSize(w, h);
    this.selectionBox.setVisible(true);
  }
}
