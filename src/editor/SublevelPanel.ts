import type { EditorState } from './EditorState';

/** List of the level's `sublevels` (id/level/unlockOn references) with add/remove. */
export class SublevelPanel {
  private el: HTMLDivElement;

  constructor(
    private state: EditorState,
    parent: HTMLElement,
  ) {
    this.el = document.createElement('div');
    parent.appendChild(this.el);
    this.render();
    // Deferred for the same reason as EditorPropertyPanel: rebuilding this panel's own DOM
    // synchronously from inside one of its own input/button handlers races the browser's
    // focus/blur cleanup and throws a "removeChild" error.
    state.onChange(() => setTimeout(() => this.render(), 0));
  }

  private render(): void {
    const sublevels = this.state.level.sublevels ?? [];
    const rows = sublevels
      .map(
        (sub, i) => `
        <div style="display:flex;gap:4px;align-items:center;">
          <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${sub.id} → ${sub.level} (${sub.unlockOn})</span>
          <button data-remove="${i}">x</button>
        </div>`,
      )
      .join('');

    this.el.innerHTML = `
      <div style="width:180px;font:12px sans-serif;color:#eee;display:flex;flex-direction:column;gap:4px;background:#20202c;padding:8px;border:1px solid #444;">
        <strong>Sublevels</strong>
        ${rows || '<span style="color:#888;">Ninguno</span>'}
        <div style="display:flex;flex-direction:column;gap:2px;margin-top:4px;">
          <input type="text" data-new="id" placeholder="id (p.ej. cueva_secreta)" />
          <input type="text" data-new="level" placeholder="level id (p.ej. level-01b)" />
          <input type="text" data-new="unlockOn" placeholder="unlockOn (p.ej. switch1:on)" />
          <button data-action="add">Añadir sublevel</button>
        </div>
      </div>
    `;

    const node = this.el;
    node.querySelectorAll<HTMLButtonElement>('button[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.state.removeSublevel(Number(btn.dataset.remove));
      });
    });

    node.querySelector('button[data-action="add"]')?.addEventListener('click', () => {
      const id = node.querySelector<HTMLInputElement>('input[data-new="id"]')?.value.trim() ?? '';
      const level = node.querySelector<HTMLInputElement>('input[data-new="level"]')?.value.trim() ?? '';
      const unlockOn = node.querySelector<HTMLInputElement>('input[data-new="unlockOn"]')?.value.trim() ?? '';
      if (id && level && unlockOn) this.state.addSublevel({ id, level, unlockOn });
    });
  }
}
