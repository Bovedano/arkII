import Phaser from 'phaser';
import { registerPenistaAnimations } from '../systems/animations';

const RUN_FRAMES = 4; // frame_000..003
const JUMP_FRAMES = 8; // frame_000..007

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload(): void {
    const bar = this.add.rectangle(480, 270, 4, 32, 0xffffff);
    this.load.on('progress', (value: number) => {
      bar.width = 4 + 460 * value;
    });

    for (const dir of ['east', 'west'] as const) {
      this.load.image(`penista-idle-${dir}`, `assets/penista/idle-${dir}.png`);
      for (let i = 0; i < RUN_FRAMES; i++) {
        this.load.image(`penista-run-${dir}-${i}`, `assets/penista/running/${dir}-${i}.png`);
      }
      for (let i = 0; i < JUMP_FRAMES; i++) {
        this.load.image(`penista-jump-${dir}-${i}`, `assets/penista/running-jump/${dir}-${i}.png`);
      }
    }
  }

  create(): void {
    registerPenistaAnimations(this);
    this.scene.start('MainMenu');
  }
}
