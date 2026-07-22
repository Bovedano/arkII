import Phaser from 'phaser';
import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { PhysicsBody } from '../core/mixins/PhysicsBody';
import { EventCapable } from '../core/mixins/EventCapable';
import { Composable } from '../core/mixins/Composable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export interface SwitchParams extends GameElementParams {
  width?: number;
  height?: number;
  offColor?: string;
  onColor?: string;
}

/**
 * A lever/switch: emits a 'level-event' (`${id}:on`) the first time the player overlaps
 * it. GameScene wires the actual overlap detection (it needs both the player and this
 * element to exist first) and calls trigger() — see GameScene.wireSwitchOverlaps().
 *
 * Uses Composable so a future switch variant can be built from child elements (e.g. a
 * separate lever-handle visual) without changing this class.
 */
export class GESwitch extends Composable(EventCapable(PhysicsBody(Renderable(GameElement<SwitchParams>)))) {
  readonly type = 'Switch';
  private activated = false;

  init(): void {
    super.init(); // propagates to children, if any (Composable)

    const { width = 32, height = 32, offColor = '#c94a4a' } = this.params;
    const rect = this.scene.add.rectangle(
      this.x,
      this.y,
      width,
      height,
      Phaser.Display.Color.HexStringToColor(offColor).color,
    );
    rect.setOrigin(0, 0);
    this.setVisual(rect);
    this.enablePhysics(); // behavior: 'sensor' (default) always gets a static overlap-only body
  }

  /** Called by GameScene's overlap callback. Idempotent — firing twice is a no-op. */
  trigger(): void {
    if (this.activated) return;
    this.activated = true;
    const { onColor = '#4ac95a' } = this.params;
    (this.visual as Phaser.GameObjects.Rectangle).setFillStyle(
      Phaser.Display.Color.HexStringToColor(onColor).color,
    );
    this.emit('level-event', `${this.id}:on`);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('Switch', (args) => new GESwitch(args as any), {
  defaultParams: { width: 32, height: 32, offColor: '#c94a4a', onColor: '#4ac95a', zIndex: 0, behavior: 'sensor' },
  paramSchema: [
    { key: 'width', label: 'Ancho', kind: 'number', default: 32 },
    { key: 'height', label: 'Alto', kind: 'number', default: 32 },
    { key: 'offColor', label: 'Color (apagado)', kind: 'color', default: '#c94a4a' },
    { key: 'onColor', label: 'Color (activado)', kind: 'color', default: '#4ac95a' },
  ],
});
