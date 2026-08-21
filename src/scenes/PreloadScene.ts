import Phaser from 'phaser';
import {
  registerPenistaAnimations,
  registerBarbacoaHumeanteAnimations,
  registerBarbacoaLadrilloAnimations,
  registerAguaRioAnimations,
  registerPajaroBlancoAnimations,
  registerEsporaDienteLeonAnimations,
} from '../systems/animations';
import { BACKGROUND_ASSETS } from '../config/backgroundAssets';
import { ARBOL_VARIANTS } from '../config/arbolVariants';
import { FLOOR_THEMES } from '../config/floorThemes';
import { appConfig } from '../config/appConfig';
import { DomOverlay } from '../editor/DomOverlay';

const RUN_FRAMES = 4; // frame_000..003
const JUMP_FRAMES = 8; // frame_000..007

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload(): void {
    this.cameras.main.setBackgroundColor('#f2600c');

    const overlay = new DomOverlay(this, {});
    overlay.root.className = 'menu-overlay title-screen';
    overlay.root.innerHTML = `
      <div class="title-scene-bg" aria-hidden="true"></div>
      <div class="title-scanlines" aria-hidden="true"></div>
      <div class="title-content">
        <div class="menu-title title-logo">${appConfig.name}</div>
        <div class="title-tagline">cargando...</div>
        <div class="loading-bar-track"><div class="loading-bar-fill"></div></div>
        <div class="loading-percent">0%</div>
      </div>
    `;
    const fill = overlay.root.querySelector<HTMLDivElement>('.loading-bar-fill')!;
    const percent = overlay.root.querySelector<HTMLDivElement>('.loading-percent')!;
    this.load.on('progress', (value: number) => {
      fill.style.width = `${Math.round(value * 100)}%`;
      percent.textContent = `${Math.round(value * 100)}%`;
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
    for (const file of ARBOL_VARIANTS) {
      this.load.image(file, `assets/blocks/arbol/${file}`);
    }
    this.load.image('matorral-con-espinas', 'assets/blocks/matorral-con-espinas.png');
    this.load.image('rama-alamo', 'assets/blocks/rama-alamo.png');
    this.load.image('mesa-comida', 'assets/blocks/mesa-comida.png');
    this.load.image('toyota-pickup', 'assets/blocks/toyota-pickup.png');
    this.load.image('coche-seat-ibiza-blanco', 'assets/blocks/coche-seat-ibiza-blanco.png');
    this.load.image('coche-seat-ibiza-negro', 'assets/blocks/coche-seat-ibiza-negro.png');
    this.load.image('coche-mercedes-azul', 'assets/blocks/coche-mercedes-azul.png');
    this.load.image('coche-opel-insignia-negro', 'assets/blocks/coche-opel-insignia-negro.png');
    this.load.image('coche-dacia-lodgy-gris', 'assets/blocks/coche-dacia-lodgy-gris.png');
    this.load.image('volvo-xc40', 'assets/blocks/volvo-xc40.png');
    this.load.image('valla-troncos', 'assets/blocks/valla-troncos.png');
    for (let i = 0; i < 5; i++) {
      this.load.image(`barbacoa-humeante-${i}`, `assets/blocks/barbacoa-humeante/frame-${i}.png`);
    }
    this.load.image('barbacoa-ladrillo', 'assets/blocks/barbacoa-ladrillo.png');
    for (let i = 0; i < 7; i++) {
      this.load.image(`barbacoa-ladrillo-encendida-${i}`, `assets/blocks/barbacoa-ladrillo-encendida/frame-${i}.png`);
    }
    for (let i = 0; i < 7; i++) {
      this.load.image(`agua-rio-${i}`, `assets/blocks/agua-rio/frame-${i}.png`);
    }
    for (const dir of ['east', 'west'] as const) {
      for (let i = 0; i < 7; i++) {
        this.load.image(`pajaro-blanco-fly-${dir}-${i}`, `assets/pajaro-blanco/fly/${dir}-${i}.png`);
      }
    }
    for (let i = 0; i < 8; i++) {
      this.load.image(`espora-diente-leon-${i}`, `assets/espora-diente-leon/frame-${i}.png`);
    }
    for (let i = 0; i < 7; i++) {
      this.load.image(`espora-diente-leon-fly-${i}`, `assets/espora-diente-leon/fly-${i}.png`);
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
    registerBarbacoaLadrilloAnimations(this);
    registerAguaRioAnimations(this);
    registerPajaroBlancoAnimations(this);
    registerEsporaDienteLeonAnimations(this);
    this.scene.start('MainMenu');
  }
}
