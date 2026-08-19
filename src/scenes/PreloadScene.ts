import Phaser from 'phaser';
import {
  registerPenistaAnimations,
  registerBarbacoaHumeanteAnimations,
  registerAguaRioAnimations,
  registerPajaroBlancoAnimations,
} from '../systems/animations';
import { BACKGROUND_ASSETS } from '../config/backgroundAssets';
import { FLOOR_THEMES } from '../config/floorThemes';

const RUN_FRAMES = 4; // frame_000..003
const JUMP_FRAMES = 8; // frame_000..007

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload(): void {
    this.cameras.main.setBackgroundColor('#f2600c');
    const bar = this.add.rectangle(480, 270, 4, 32, 0x141414);
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

    this.load.image('cerveza-estrella', 'assets/collectibles/cerveza-estrella.png');
    this.load.image('arbol', 'assets/blocks/arbol.png');
    this.load.image('matorral-con-espinas', 'assets/blocks/matorral-con-espinas.png');
    this.load.image('rama-alamo', 'assets/blocks/rama-alamo.png');
    this.load.image('mesa-comida', 'assets/blocks/mesa-comida.png');
    this.load.image('toyota-pickup', 'assets/blocks/toyota-pickup.png');
    this.load.image('coche-seat-ibiza-blanco', 'assets/blocks/coche-seat-ibiza-blanco.png');
    this.load.image('coche-seat-ibiza-negro', 'assets/blocks/coche-seat-ibiza-negro.png');
    this.load.image('coche-mercedes-azul', 'assets/blocks/coche-mercedes-azul.png');
    this.load.image('coche-opel-insignia-negro', 'assets/blocks/coche-opel-insignia-negro.png');
    for (let i = 0; i < 5; i++) {
      this.load.image(`barbacoa-humeante-${i}`, `assets/blocks/barbacoa-humeante/frame-${i}.png`);
    }
    for (let i = 0; i < 7; i++) {
      this.load.image(`agua-rio-${i}`, `assets/blocks/agua-rio/frame-${i}.png`);
    }
    for (const dir of ['east', 'west'] as const) {
      for (let i = 0; i < 7; i++) {
        this.load.image(`pajaro-blanco-fly-${dir}-${i}`, `assets/pajaro-blanco/fly/${dir}-${i}.png`);
      }
    }

    for (const file of BACKGROUND_ASSETS) {
      this.load.image(file, `assets/backgrounds/${file}`);
    }

    for (const theme of FLOOR_THEMES) {
      this.load.image(`floor-${theme}-left`, `assets/blocks/floor/${theme}/left.png`);
      this.load.image(`floor-${theme}-center`, `assets/blocks/floor/${theme}/center.png`);
      this.load.image(`floor-${theme}-right`, `assets/blocks/floor/${theme}/right.png`);
      this.load.json(`floor-${theme}-manifest`, `assets/blocks/floor/${theme}/manifest.json`);
    }
  }

  create(): void {
    registerPenistaAnimations(this);
    registerBarbacoaHumeanteAnimations(this);
    registerAguaRioAnimations(this);
    registerPajaroBlancoAnimations(this);
    this.scene.start('MainMenu');
  }
}
