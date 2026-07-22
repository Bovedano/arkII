import Phaser from 'phaser';
import { GameElementRegistry } from '../game-elements/core/registry';
import type { GameElementBehavior } from '../game-elements/core/types';
import type { EditorState } from './EditorState';

const BEHAVIORS: GameElementBehavior[] = ['solid', 'background', 'hidden', 'sensor'];

/** Right-side property panel: common zIndex/behavior/position fields plus per-type fields
 *  read generically from the selected element's GameElementTypeMeta.paramSchema — so adding
 *  a new GameElement type never requires touching this panel. */
export class EditorPropertyPanel {
  private dom: Phaser.GameObjects.DOMElement;

  constructor(
    scene: Phaser.Scene,
    private state: EditorState,
    x: number,
    y: number,
  ) {
    this.dom = scene.add.dom(x, y).setOrigin(0, 0);
    this.render();
    // Deferred: rebuilding this panel's DOM synchronously from inside one of its own
    // inputs' `change` handler races the browser's focus/blur cleanup and throws a
    // "removeChild" error — let the current event finish first.
    state.onChange(() => setTimeout(() => this.render(), 0));
  }

  private render(): void {
    const index = this.state.selectedIndex;
    const def = index !== null ? this.state.level.elements[index] : null;

    if (def === null || def === undefined || index === null) {
      this.dom.createFromHTML(
        '<div style="width:190px;font:12px sans-serif;color:#888;background:#20202c;padding:8px;border:1px solid #444;">Selecciona un elemento</div>',
      );
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
        const inputType = field.kind === 'color' ? 'color' : field.kind === 'number' ? 'number' : 'text';
        return `<label style="display:flex;justify-content:space-between;">${field.label}<input type="${inputType}" data-key="${field.key}" data-kind="${field.kind}" value="${String(value)}" /></label>`;
      })
      .join('');

    this.dom.createFromHTML(`
      <div style="width:190px;font:12px sans-serif;color:#eee;display:flex;flex-direction:column;gap:4px;background:#20202c;padding:8px;border:1px solid #444;">
        <strong>${def.type} (${def.id ?? ''})</strong>
        <label style="display:flex;justify-content:space-between;">X <input type="number" data-field="x" value="${def.x}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Y <input type="number" data-field="y" value="${def.y}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">zIndex <input type="number" data-field="zIndex" value="${def.params.zIndex}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">behavior <select data-field="behavior">${behaviorOptions}</select></label>
        ${schemaFields}
        <button data-action="delete" style="margin-top:6px;">Eliminar</button>
      </div>
    `);

    const node = this.dom.node as HTMLElement;

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

    node.querySelectorAll<HTMLInputElement>('input[data-key]').forEach((input) => {
      input.addEventListener('change', () => {
        const key = input.dataset.key as string;
        const kind = input.dataset.kind;
        const value = kind === 'boolean' ? input.checked : kind === 'number' ? Number(input.value) : input.value;
        this.state.updateElementParam(index, key, value);
      });
    });

    node.querySelector('button[data-action="delete"]')?.addEventListener('click', () => {
      this.state.removeElement(index);
    });
  }
}
