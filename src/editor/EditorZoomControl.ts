import type { EditorState } from './EditorState';

/** Zoom slider for the editor viewport — lives in the sidebar (not floated over the canvas)
 *  for the same reason as the other panels: Phaser.Scale.FIT breaks fixed-position math tied
 *  to canvas coordinates, see LevelEditorScene. */
export class EditorZoomControl {
  constructor(state: EditorState, parent: HTMLElement) {
    const el = document.createElement('div');
    el.style.cssText =
      'width:190px;font:12px sans-serif;color:#eee;display:flex;align-items:center;gap:6px;background:#20202c;padding:8px;border:1px solid #444;box-sizing:border-box;';
    el.innerHTML = `
      <span>Zoom</span>
      <input type="range" data-field="zoom" min="0.1" max="3" step="0.05" value="${state.zoom}" style="flex:1;" />
      <span data-field="zoom-label" style="width:36px;text-align:right;">${Math.round(state.zoom * 100)}%</span>
    `;
    parent.appendChild(el);

    const slider = el.querySelector<HTMLInputElement>('input[data-field="zoom"]')!;
    const label = el.querySelector<HTMLSpanElement>('span[data-field="zoom-label"]')!;

    slider.addEventListener('input', () => {
      state.setZoom(Number(slider.value));
    });

    state.onViewChange(() => {
      slider.value = String(state.zoom);
      label.textContent = `${Math.round(state.zoom * 100)}%`;
    });
  }
}
