import Phaser from 'phaser';
import { GameElementRegistry } from '../game-elements/core/registry';
import type { EditorState } from './EditorState';
import type { EditorCanvas } from './EditorCanvas';

export interface PaletteRect {
  x: number;
  y: number;
  width: number;
}

/**
 * Left-side palette: one draggable label per GameElementRegistry.list() entry. Dragging a
 * label spawns a ghost that follows the pointer; dropping it over the canvas viewport adds
 * a new element of that type at the drop position (with the type's default params).
 */
export class EditorPalette {
  constructor(scene: Phaser.Scene, state: EditorState, canvas: EditorCanvas, rect: PaletteRect) {
    scene.add.text(rect.x, rect.y, 'Elementos', { fontSize: '14px', color: '#ffffff' });

    let y = rect.y + 26;
    for (const { type } of GameElementRegistry.list()) {
      const label = scene.add
        .text(rect.x, y, type, {
          fontSize: '14px',
          color: '#cccccc',
          backgroundColor: '#2a2a3a',
          padding: { x: 6, y: 4 },
        })
        .setInteractive({ useHandCursor: true });
      scene.input.setDraggable(label);

      let ghost: Phaser.GameObjects.Text | null = null;
      label.on('dragstart', () => {
        ghost = scene.add
          .text(label.x, label.y, type, { fontSize: '14px', color: '#ffd24a' })
          .setDepth(1000);
      });
      label.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        ghost?.setPosition(dragX, dragY);
      });
      label.on('dragend', (pointer: Phaser.Input.Pointer) => {
        ghost?.destroy();
        ghost = null;
        if (canvas.containsScreenPoint(pointer.x, pointer.y)) {
          const { x: levelX, y: levelY } = canvas.screenToLevel(pointer.x, pointer.y);
          state.addElement(type, Math.round(levelX), Math.round(levelY));
        }
      });

      y += 30;
    }
  }
}
