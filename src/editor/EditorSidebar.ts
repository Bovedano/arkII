import Phaser from 'phaser';

/**
 * Real DOM sibling of the Phaser canvas (`#editor-sidebar` in index.html), not a floating
 * `position: fixed` overlay — a genuine flexbox column that reserves its own screen space, so
 * `#app` (its flex sibling, holding the game canvas) is guaranteed by CSS to shrink and make
 * room for it rather than the sidebar floating on top and guessing at the canvas's actual
 * rendered bounds. Toggling `.active` changes #app's width, so Phaser's Scale.FIT — which
 * only recomputes on a window `resize` event — must be told explicitly to re-measure.
 */
export class EditorSidebar {
  readonly root: HTMLDivElement;

  constructor(scene: Phaser.Scene) {
    const el = document.getElementById('editor-sidebar');
    if (!el) throw new Error('#editor-sidebar missing from index.html');
    this.root = el as HTMLDivElement;
    this.root.classList.add('active');
    this.root.innerHTML = '';
    // `refresh()` alone only recomputes scale from the *cached* parent size — it does not
    // re-measure `#app`'s box. Only `getParentBounds()` re-reads getBoundingClientRect(), so
    // it must run first or the canvas keeps using #app's pre-sidebar (full-width) size until
    // something else (e.g. a real window resize) forces a re-measure.
    scene.scale.getParentBounds();
    scene.scale.refresh();
    scene.events.once('shutdown', () => {
      this.root.classList.remove('active');
      this.root.innerHTML = '';
      scene.scale.getParentBounds();
      scene.scale.refresh();
    });
  }
}
