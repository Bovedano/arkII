import { GameElementRegistry } from '../game-elements/core/registry';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig';
import type { GameElementBehavior } from '../game-elements/core/types';
import type { EditorState } from './EditorState';

const BEHAVIORS: GameElementBehavior[] = ['solid', 'background', 'sensor', 'damage', 'semisolid'];

/** Right-side property panel: common zIndex/behavior/position fields plus per-type fields
 *  read generically from the selected element's GameElementTypeMeta.paramSchema — so adding
 *  a new GameElement type never requires touching this panel. */
export class EditorPropertyPanel {
  private el: HTMLDivElement;

  constructor(
    private state: EditorState,
    parent: HTMLElement,
  ) {
    this.el = document.createElement('div');
    parent.appendChild(this.el);
    this.render();
    // Deferred: rebuilding this panel's DOM synchronously from inside one of its own
    // inputs' `change` handler races the browser's focus/blur cleanup and throws a
    // "removeChild" error — let the current event finish first.
    const scheduleRender = () => setTimeout(() => this.render(), 0);
    state.onChange(scheduleRender);
    state.onSelectionChange(scheduleRender);
    state.onMove(scheduleRender);
  }

  private render(): void {
    const groupInstanceIndex = this.state.selectedGroupInstanceIndex;
    if (groupInstanceIndex !== null) {
      this.renderGroupInstance(groupInstanceIndex);
      return;
    }
    if (this.state.multiSelected.size >= 2 && !this.state.editingGroupId) {
      this.renderMultiSelect();
      return;
    }

    const index = this.state.selectedIndex;
    const def = index !== null ? this.state.activeElements[index] : null;

    if (def === null || def === undefined || index === null) {
      this.el.innerHTML =
        '<div style="width:190px;font:12px sans-serif;color:#888;background:#20202c;padding:8px;border:1px solid #444;">Selecciona un elemento</div>';
      return;
    }

    const meta = GameElementRegistry.getMeta(def.type);
    const behaviorOptions = BEHAVIORS.map(
      (b) => `<option value="${b}" ${def.params.behavior === b ? 'selected' : ''}>${b}</option>`,
    ).join('');

    const schemaFields = meta.paramSchema
      .map((field) => {
        const value = def.params[field.key] ?? field.default;
        if (field.kind === 'boolean') {
          const checked = value ? 'checked' : '';
          return `<label style="display:flex;justify-content:space-between;">${field.label}<input type="checkbox" data-key="${field.key}" data-kind="boolean" ${checked} /></label>`;
        }
        if (field.kind === 'select') {
          const fieldOptions = (field.options ?? [])
            .map((opt) => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`)
            .join('');
          return `<label style="display:flex;justify-content:space-between;">${field.label}<select data-key="${field.key}" data-kind="select">${fieldOptions}</select></label>`;
        }
        const inputType = field.kind === 'color' ? 'color' : field.kind === 'number' ? 'number' : 'text';
        return `<label style="display:flex;justify-content:space-between;">${field.label}<input type="${inputType}" data-key="${field.key}" data-kind="${field.kind}" value="${String(value)}" /></label>`;
      })
      .join('');

    const positionHint = meta.fixedToCamera
      ? `<div style="color:#888;font-size:11px;">Posición fija en pantalla (0–${GAME_WIDTH} × 0–${GAME_HEIGHT}), no es coordenada del nivel.</div>`
      : '';

    this.el.innerHTML = `
      <div style="width:190px;font:12px sans-serif;color:#eee;display:flex;flex-direction:column;gap:4px;background:#20202c;padding:8px;border:1px solid #444;">
        <strong>${def.type} (${def.id ?? ''})</strong>
        ${positionHint}
        <label style="display:flex;justify-content:space-between;">X <input type="number" data-field="x" value="${def.x}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Y <input type="number" data-field="y" value="${def.y}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">zIndex <input type="number" data-field="zIndex" value="${def.params.zIndex}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">behavior <select data-field="behavior">${behaviorOptions}</select></label>
        <label style="display:flex;justify-content:space-between;">hidden <input type="checkbox" data-field="hidden" ${def.params.hidden ? 'checked' : ''} /></label>
        <label style="display:flex;justify-content:space-between;">Carry (arrastra al jugador) <input type="checkbox" data-field="carry" ${def.params.carry ? 'checked' : ''} /></label>
        <label style="display:flex;justify-content:space-between;">Escala <input type="number" step="0.1" data-field="scale" value="${def.params.scale ?? 1}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Rotación <input type="number" step="1" data-field="rotation" value="${def.params.rotation ?? 0}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Espejo H <input type="checkbox" data-field="flipX" ${def.params.flipX ? 'checked' : ''} /></label>
        <label style="display:flex;justify-content:space-between;">Espejo V <input type="checkbox" data-field="flipY" ${def.params.flipY ? 'checked' : ''} /></label>
        ${schemaFields}
        <div style="display:flex;gap:4px;margin-top:6px;">
          <button data-action="duplicate" style="flex:1;">Duplicar</button>
          <button data-action="delete" style="flex:1;">Eliminar</button>
        </div>
      </div>
    `;

    const node = this.el;

    const applyPosition = () => {
      const nx = Number(node.querySelector<HTMLInputElement>('input[data-field="x"]')?.value ?? def.x);
      const ny = Number(node.querySelector<HTMLInputElement>('input[data-field="y"]')?.value ?? def.y);
      this.state.moveElement(index, nx, ny);
    };
    node.querySelector<HTMLInputElement>('input[data-field="x"]')?.addEventListener('change', applyPosition);
    node.querySelector<HTMLInputElement>('input[data-field="y"]')?.addEventListener('change', applyPosition);

    node.querySelector<HTMLInputElement>('input[data-field="zIndex"]')?.addEventListener('change', (event) => {
      this.state.updateElementParam(index, 'zIndex', Number((event.target as HTMLInputElement).value));
    });

    node.querySelector<HTMLSelectElement>('select[data-field="behavior"]')?.addEventListener('change', (event) => {
      this.state.updateElementParam(index, 'behavior', (event.target as HTMLSelectElement).value);
    });

    node.querySelector<HTMLInputElement>('input[data-field="scale"]')?.addEventListener('change', (event) => {
      this.state.updateElementParam(index, 'scale', Number((event.target as HTMLInputElement).value));
    });

    node.querySelector<HTMLInputElement>('input[data-field="rotation"]')?.addEventListener('change', (event) => {
      this.state.updateElementParam(index, 'rotation', Number((event.target as HTMLInputElement).value));
    });

    node.querySelector<HTMLInputElement>('input[data-field="flipX"]')?.addEventListener('change', (event) => {
      this.state.updateElementParam(index, 'flipX', (event.target as HTMLInputElement).checked);
    });

    node.querySelector<HTMLInputElement>('input[data-field="flipY"]')?.addEventListener('change', (event) => {
      this.state.updateElementParam(index, 'flipY', (event.target as HTMLInputElement).checked);
    });

    node.querySelector<HTMLInputElement>('input[data-field="hidden"]')?.addEventListener('change', (event) => {
      const checked = (event.target as HTMLInputElement).checked;
      this.state.updateElementParam(index, 'hidden', checked);
      // Convenience default for the common case (invisible wall) — hidden elements are usually
      // meant to still collide. Just a starting point: the user can change `behavior` after.
      if (checked) this.state.updateElementParam(index, 'behavior', 'solid');
    });

    node.querySelector<HTMLInputElement>('input[data-field="carry"]')?.addEventListener('change', (event) => {
      this.state.updateElementParam(index, 'carry', (event.target as HTMLInputElement).checked);
    });

    node.querySelectorAll<HTMLInputElement>('input[data-key]').forEach((input) => {
      input.addEventListener('change', () => {
        const key = input.dataset.key as string;
        const kind = input.dataset.kind;
        const value = kind === 'boolean' ? input.checked : kind === 'number' ? Number(input.value) : input.value;
        this.state.updateElementParam(index, key, value);
      });
    });

    node.querySelectorAll<HTMLSelectElement>('select[data-key]').forEach((select) => {
      select.addEventListener('change', () => {
        const key = select.dataset.key as string;
        this.state.updateElementParam(index, key, select.value);
      });
    });

    node.querySelector('button[data-action="duplicate"]')?.addEventListener('click', () => {
      this.state.duplicateElement(index);
    });

    node.querySelector('button[data-action="delete"]')?.addEventListener('click', () => {
      this.state.removeElement(index);
    });
  }

  private renderGroupInstance(index: number): void {
    const inst = this.state.level.groupInstances?.[index];
    if (!inst) {
      this.el.innerHTML = '';
      return;
    }
    const groupName = this.state.level.groups?.find((g) => g.id === inst.groupId)?.name ?? inst.groupId;

    this.el.innerHTML = `
      <div style="width:190px;font:12px sans-serif;color:#eee;display:flex;flex-direction:column;gap:4px;background:#20202c;padding:8px;border:1px solid #444;">
        <strong>Grupo: ${groupName}</strong>
        <label style="display:flex;justify-content:space-between;">X <input type="number" data-field="x" value="${inst.x}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Y <input type="number" data-field="y" value="${inst.y}" style="width:70px;" /></label>
        <button data-action="edit-group">Editar grupo</button>
        <button data-action="delete-instance" style="margin-top:6px;">Eliminar instancia</button>
      </div>
    `;

    const node = this.el;
    const applyPosition = () => {
      const nx = Number(node.querySelector<HTMLInputElement>('input[data-field="x"]')?.value ?? inst.x);
      const ny = Number(node.querySelector<HTMLInputElement>('input[data-field="y"]')?.value ?? inst.y);
      this.state.moveGroupInstance(index, nx, ny);
    };
    node.querySelector<HTMLInputElement>('input[data-field="x"]')?.addEventListener('change', applyPosition);
    node.querySelector<HTMLInputElement>('input[data-field="y"]')?.addEventListener('change', applyPosition);
    node.querySelector('button[data-action="edit-group"]')?.addEventListener('click', () => {
      this.state.enterGroupEdit(inst.groupId);
    });
    node.querySelector('button[data-action="delete-instance"]')?.addEventListener('click', () => {
      this.state.removeGroupInstance(index);
    });
  }

  /** Shown when ≥2 elements are multi-selected (shift-click) — the entry point for turning
   *  a selection into a reusable, named GroupDef. */
  private renderMultiSelect(): void {
    const count = this.state.multiSelected.size;
    this.el.innerHTML = `
      <div style="width:190px;font:12px sans-serif;color:#eee;display:flex;flex-direction:column;gap:4px;background:#20202c;padding:8px;border:1px solid #444;">
        <strong>${count} elementos seleccionados</strong>
        <input type="text" data-field="group-name" placeholder="Nombre de la agrupación" />
        <button data-action="create-group">Crear grupo</button>
      </div>
    `;

    const node = this.el;
    node.querySelector('button[data-action="create-group"]')?.addEventListener('click', () => {
      const name = node.querySelector<HTMLInputElement>('input[data-field="group-name"]')?.value.trim();
      if (name) this.state.createGroupFromSelection(name);
    });
  }
}
