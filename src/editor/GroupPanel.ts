import type { EditorState } from './EditorState';

/** List of the level's `groups` (shared, reusable definitions) with rename/delete, and the
 *  entry/exit point for group-edit mode — mirrors SublevelPanel's list+add/remove pattern.
 *  The actual editing of a group's contents reuses the existing canvas + EditorPropertyPanel
 *  (see EditorState.activeElements), this panel only shows a banner while that's active. */
export class GroupPanel {
  private el: HTMLDivElement;
  /** Group id awaiting a cascade-delete confirmation ("¿Eliminar N instancias también?"). */
  private confirmingDeleteId: string | null = null;

  constructor(
    private state: EditorState,
    parent: HTMLElement,
  ) {
    this.el = document.createElement('div');
    parent.appendChild(this.el);
    this.render();
    // Deferred for the same reason as EditorPropertyPanel/SublevelPanel: rebuilding this
    // panel's own DOM synchronously from inside one of its own input/button handlers races
    // the browser's focus/blur cleanup and throws a "removeChild" error.
    state.onChange(() => setTimeout(() => this.render(), 0));
  }

  private render(): void {
    if (this.state.editingGroupId) {
      this.renderEditingBanner(this.state.editingGroupId);
      return;
    }

    const groups = this.state.level.groups ?? [];
    const instances = this.state.level.groupInstances ?? [];
    const rows = groups
      .map((group) => {
        const usage = instances.filter((gi) => gi.groupId === group.id).length;
        if (this.confirmingDeleteId === group.id) {
          return `
          <div style="display:flex;flex-direction:column;gap:2px;">
            <span>¿Eliminar ${usage} instancia(s) de "${group.name}" también?</span>
            <div style="display:flex;gap:4px;">
              <button data-cascade-yes="${group.id}">Sí</button>
              <button data-cascade-no="${group.id}">No</button>
            </div>
          </div>`;
        }
        return `
        <div style="display:flex;gap:4px;align-items:center;">
          <input type="text" data-rename="${group.id}" value="${group.name}" style="flex:1;min-width:0;" />
          <span style="color:#888;">(${usage})</span>
          <button data-edit="${group.id}">Editar</button>
          <button data-delete="${group.id}">x</button>
        </div>`;
      })
      .join('');

    this.el.innerHTML = `
      <div style="width:190px;font:12px sans-serif;color:#eee;display:flex;flex-direction:column;gap:4px;background:#20202c;padding:8px;border:1px solid #444;">
        <strong>Agrupaciones</strong>
        ${rows || '<span style="color:#888;">Ninguna — selecciona 2+ elementos para crear una</span>'}
      </div>
    `;

    const node = this.el;
    node.querySelectorAll<HTMLInputElement>('input[data-rename]').forEach((input) => {
      input.addEventListener('change', () => {
        this.state.renameGroup(input.dataset.rename as string, input.value.trim());
      });
    });
    node.querySelectorAll<HTMLButtonElement>('button[data-edit]').forEach((btn) => {
      btn.addEventListener('click', () => this.state.enterGroupEdit(btn.dataset.edit as string));
    });
    node.querySelectorAll<HTMLButtonElement>('button[data-delete]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const groupId = btn.dataset.delete as string;
        const result = this.state.deleteGroup(groupId);
        if (result === 'blocked') {
          this.confirmingDeleteId = groupId;
          this.render();
        }
      });
    });
    node.querySelectorAll<HTMLButtonElement>('button[data-cascade-yes]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.state.deleteGroup(btn.dataset.cascadeYes as string, { cascade: true });
        this.confirmingDeleteId = null;
      });
    });
    node.querySelectorAll<HTMLButtonElement>('button[data-cascade-no]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.confirmingDeleteId = null;
        this.render();
      });
    });
  }

  private renderEditingBanner(groupId: string): void {
    const name = this.state.level.groups?.find((g) => g.id === groupId)?.name ?? groupId;
    this.el.innerHTML = `
      <div style="width:190px;font:12px sans-serif;color:#eee;display:flex;flex-direction:column;gap:4px;background:#20202c;padding:8px;border:1px solid #444;">
        <strong>Editando grupo: ${name}</strong>
        <span style="color:#888;">Los cambios se aplican a todos los sitios donde se use.</span>
        <button data-action="exit">Salir del grupo</button>
      </div>
    `;
    this.el.querySelector('button[data-action="exit"]')?.addEventListener('click', () => {
      this.state.exitGroupEdit();
    });
  }
}
