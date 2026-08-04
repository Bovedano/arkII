import Phaser from 'phaser';

/**
 * A plain HTML element positioned with fixed CSS, completely independent of Phaser's canvas
 * scaling. `scene.add.dom()` elements misplace themselves horizontally once the canvas is
 * scaled by `Phaser.Scale.FIT` to anything other than 1:1 — which is every real browser
 * window — so the editor's UI chrome (side panels, modals) is built as ordinary DOM attached
 * to `document.body` instead. Auto-removed when the owning scene shuts down.
 */
export class DomOverlay {
  readonly root: HTMLDivElement;

  constructor(scene: Phaser.Scene, style: Partial<CSSStyleDeclaration>) {
    this.root = document.createElement('div');
    Object.assign(this.root.style, { position: 'fixed', zIndex: '10000' });
    Object.assign(this.root.style, style);
    document.body.appendChild(this.root);
    scene.events.once('shutdown', () => this.root.remove());
  }
}
