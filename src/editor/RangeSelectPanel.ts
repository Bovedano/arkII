import type { EditorState } from './EditorState';

type Axis = 'x' | 'y';

/** Lets the user drag two range sliders (min/max) along either the X or Y axis to select every
 *  element AND placed group instance whose position falls inside that window, updating the
 *  selection live as either slider moves (see EditorState.selectRange). The slider bounds are
 *  derived from the level's actual min/max positions on the chosen axis, so dragging a slider
 *  all the way to one end always reaches the leftmost/topmost item and the other end the
 *  rightmost/bottommost one. Position means the same thing it does everywhere else in the
 *  editor — the raw def.x/def.y (or groupInstance.x/y), the same value the property panel's
 *  X/Y fields show — not the item's true bounding-box edge, which can differ for
 *  center-origin sprites. */
export class RangeSelectPanel {
  private el: HTMLDivElement;
  private axis: Axis = 'x';
  /** Current slider window, in level coordinates. Persists across re-renders triggered by
   *  unrelated level edits (see constructor) so an in-progress window survives e.g. editing a
   *  param in another panel; reset only when the axis is switched, since a window's numbers
   *  don't carry any meaning across axes. */
  private min = 0;
  private max = 0;
  /** False right after mount or an axis switch — the first render() with known bounds seeds
   *  min/max to the full range ("everything"); later re-renders instead clamp the
   *  user-chosen window into the (possibly shrunk) new bounds. */
  private seeded = false;

  constructor(
    private state: EditorState,
    parent: HTMLElement,
  ) {
    this.el = document.createElement('div');
    parent.appendChild(this.el);
    this.render();
    // Deferred for the same reason as the other sidebar panels (EditorPropertyPanel etc.):
    // rebuilding this panel's own DOM synchronously from inside one of its own inputs' change
    // handler races the browser's focus/blur cleanup and throws a "removeChild" error. Note
    // this only fires on structural edits (onChange) — selection changes (including this
    // panel's own slider drags) deliberately do NOT rebuild this DOM, or dragging a native
    // range input would be cut short by its own element being torn down mid-gesture.
    state.onChange(() => setTimeout(() => this.render(), 0));
  }

  /** Every selectable item's (index, position-on-current-axis) — elements from
   *  `activeElements`, plus placed group instances when not currently editing one (mirrors
   *  EditorCanvas hiding group instances while editing a group's contents — there's nothing to
   *  select at that level). */
  private items(): { elements: { index: number; pos: number }[]; groups: { index: number; pos: number }[] } {
    const pos = (x: number, y: number) => (this.axis === 'x' ? x : y);
    const elements = this.state.activeElements.map((def, index) => ({ index, pos: pos(def.x, def.y) }));
    const groups = this.state.editingGroupId
      ? []
      : (this.state.level.groupInstances ?? []).map((inst, index) => ({ index, pos: pos(inst.x, inst.y) }));
    return { elements, groups };
  }

  private bounds(): { min: number; max: number } | null {
    const { elements, groups } = this.items();
    const positions = [...elements, ...groups].map((i) => i.pos);
    if (positions.length === 0) return null;
    return { min: Math.min(...positions), max: Math.max(...positions) };
  }

  /** Applies the current [min, max] window as the live selection and returns how many items
   *  ended up selected, for the count label. Only ever called from a slider's own 'input'
   *  handler — never from render() — so simply opening/re-rendering this panel never
   *  overwrites whatever selection the user already has via other means (canvas clicks, etc). */
  private applySelection(): number {
    const { elements, groups } = this.items();
    const elementIndices = elements.filter((i) => i.pos >= this.min && i.pos <= this.max).map((i) => i.index);
    const groupIndices = groups.filter((i) => i.pos >= this.min && i.pos <= this.max).map((i) => i.index);
    this.state.selectRange(elementIndices, groupIndices);
    return elementIndices.length + groupIndices.length;
  }

  private render(): void {
    this.el.style.cssText =
      'width:190px;font:12px sans-serif;color:#eee;display:flex;flex-direction:column;gap:6px;' +
      'background:#20202c;padding:8px;border:1px solid #444;box-sizing:border-box;';

    const bounds = this.bounds();
    if (!bounds) {
      this.el.innerHTML = '<strong>Seleccionar por rango</strong><span style="color:#888;">No hay elementos</span>';
      return;
    }

    if (!this.seeded) {
      this.min = bounds.min;
      this.max = bounds.max;
      this.seeded = true;
    } else {
      this.min = Math.min(Math.max(this.min, bounds.min), bounds.max);
      this.max = Math.max(Math.min(this.max, bounds.max), bounds.min);
    }

    this.el.innerHTML = `
      <strong>Seleccionar por rango</strong>
      <div style="display:flex;gap:12px;">
        <label style="display:flex;align-items:center;gap:3px;">
          <input type="radio" name="range-axis" value="x" ${this.axis === 'x' ? 'checked' : ''} /> X
        </label>
        <label style="display:flex;align-items:center;gap:3px;">
          <input type="radio" name="range-axis" value="y" ${this.axis === 'y' ? 'checked' : ''} /> Y
        </label>
      </div>
      <label style="display:flex;flex-direction:column;gap:2px;">
        <span>Mín: <span data-field="min-label">${Math.round(this.min)}</span></span>
        <input type="range" data-field="min" min="${bounds.min}" max="${bounds.max}" step="1" value="${this.min}" />
      </label>
      <label style="display:flex;flex-direction:column;gap:2px;">
        <span>Máx: <span data-field="max-label">${Math.round(this.max)}</span></span>
        <input type="range" data-field="max" min="${bounds.min}" max="${bounds.max}" step="1" value="${this.max}" />
      </label>
      <span data-field="count" style="color:#888;"></span>
    `;

    const node = this.el;
    const minSlider = node.querySelector<HTMLInputElement>('input[data-field="min"]')!;
    const maxSlider = node.querySelector<HTMLInputElement>('input[data-field="max"]')!;
    const minLabel = node.querySelector<HTMLSpanElement>('span[data-field="min-label"]')!;
    const maxLabel = node.querySelector<HTMLSpanElement>('span[data-field="max-label"]')!;
    const countLabel = node.querySelector<HTMLSpanElement>('span[data-field="count"]')!;

    const updateCount = () => {
      countLabel.textContent = `${this.applySelection()} seleccionado(s)`;
    };

    // Each slider clamps against the other (dragging min past the current max drags max along
    // with it, and vice versa) so the window can never invert — standard dual-slider behavior.
    minSlider.addEventListener('input', () => {
      this.min = Number(minSlider.value);
      if (this.min > this.max) {
        this.max = this.min;
        maxSlider.value = String(this.max);
        maxLabel.textContent = String(Math.round(this.max));
      }
      minLabel.textContent = String(Math.round(this.min));
      updateCount();
    });
    maxSlider.addEventListener('input', () => {
      this.max = Number(maxSlider.value);
      if (this.max < this.min) {
        this.min = this.max;
        minSlider.value = String(this.min);
        minLabel.textContent = String(Math.round(this.min));
      }
      maxLabel.textContent = String(Math.round(this.max));
      updateCount();
    });

    node.querySelectorAll<HTMLInputElement>('input[name="range-axis"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        this.axis = radio.value as Axis;
        this.seeded = false;
        this.render();
      });
    });
  }
}
