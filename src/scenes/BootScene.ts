import Phaser from 'phaser';

/** Loads just enough to move on — nothing here yet, no loading-bar art in the project so far. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    this.scene.start('Preload');
  }
}
