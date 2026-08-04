import { BACKGROUND_ASSETS } from '../config/backgroundAssets';
import type { EditorState } from './EditorState';

/** Form for the level's own metadata/config (id, title, size, gravity, background). */
export class LevelConfigPanel {
  private el: HTMLDivElement;

  constructor(
    private state: EditorState,
    parent: HTMLElement,
  ) {
    this.el = document.createElement('div');
    parent.appendChild(this.el);
    this.render();
    // Deferred for the same reason as SublevelPanel: the element dropdown's options depend on
    // `level.elements`, so it must refresh when elements are added/removed/renamed elsewhere —
    // but rebuilding synchronously from inside our own input handler races focus/blur cleanup.
    state.onChange(() => setTimeout(() => this.render(), 0));
  }

  private render(): void {
    const { level } = this.state;
    const camera = level.config.camera;
    const backgroundImage = level.config.backgroundImage;
    const followOptions = level.elements
      .map((el, i) => el.id ?? `${el.type}-${i}`)
      .map((id) => `<option value="${id}" ${camera?.follow === id ? 'selected' : ''}>${id}</option>`)
      .join('');
    const backgroundImageOptions = BACKGROUND_ASSETS.map(
      (file) => `<option value="${file}" ${backgroundImage?.image === file ? 'selected' : ''}>${file}</option>`,
    ).join('');
    this.el.innerHTML = `
      <div style="width:190px;font:12px sans-serif;color:#eee;display:flex;flex-direction:column;gap:4px;background:#20202c;padding:8px;border:1px solid #444;">
        <strong>Nivel</strong>
        <label style="display:flex;justify-content:space-between;">Id <input type="text" data-field="id" value="${level.id}" style="width:100px;" /></label>
        <label style="display:flex;justify-content:space-between;">Título <input type="text" data-field="title" value="${level.title}" style="width:100px;" /></label>
        <label style="display:flex;justify-content:space-between;">Ancho <input type="number" data-field="width" value="${level.config.width}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Alto <input type="number" data-field="height" value="${level.config.height}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Gravedad <input type="number" data-field="gravity" value="${level.config.gravity}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Duración (s) <input type="number" min="0" data-field="timeLimitSec" value="${level.config.timeLimitSec ?? 300}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Fondo <input type="color" data-field="background" value="${level.config.background}" /></label>
        <label style="display:flex;justify-content:space-between;">Imagen fondo
          <select data-field="backgroundImage" style="width:100px;">
            <option value="">(ninguna)</option>
            ${backgroundImageOptions}
          </select>
        </label>
        <label style="display:flex;justify-content:space-between;">Parallax X (%) <input type="number" min="0" max="100" data-field="parallaxX" value="${backgroundImage?.parallaxX ?? 100}" style="width:70px;" ${backgroundImage ? '' : 'disabled'} /></label>
        <label style="display:flex;justify-content:space-between;">Parallax Y (%) <input type="number" min="0" max="100" data-field="parallaxY" value="${backgroundImage?.parallaxY ?? 100}" style="width:70px;" ${backgroundImage ? '' : 'disabled'} /></label>
        <strong>Cámara</strong>
        <label style="display:flex;justify-content:space-between;">Seguir a
          <select data-field="camera-follow" style="width:100px;">
            <option value="">(personaje principal)</option>
            ${followOptions}
          </select>
        </label>
        <label style="display:flex;justify-content:space-between;">Margen X <input type="number" min="0" data-field="camera-marginX" value="${camera?.marginX ?? 0}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Margen Y <input type="number" min="0" data-field="camera-marginY" value="${camera?.marginY ?? 0}" style="width:70px;" /></label>
      </div>
    `;

    const node = this.el;
    node.querySelector<HTMLInputElement>('input[data-field="id"]')?.addEventListener('change', (event) => {
      this.state.setLevelMeta({ id: (event.target as HTMLInputElement).value });
    });
    node.querySelector<HTMLInputElement>('input[data-field="title"]')?.addEventListener('change', (event) => {
      this.state.setLevelMeta({ title: (event.target as HTMLInputElement).value });
    });
    node.querySelector<HTMLInputElement>('input[data-field="width"]')?.addEventListener('change', (event) => {
      this.state.setLevelConfig({ width: Number((event.target as HTMLInputElement).value) });
    });
    node.querySelector<HTMLInputElement>('input[data-field="height"]')?.addEventListener('change', (event) => {
      this.state.setLevelConfig({ height: Number((event.target as HTMLInputElement).value) });
    });
    node.querySelector<HTMLInputElement>('input[data-field="gravity"]')?.addEventListener('change', (event) => {
      this.state.setLevelConfig({ gravity: Number((event.target as HTMLInputElement).value) });
    });
    node.querySelector<HTMLInputElement>('input[data-field="timeLimitSec"]')?.addEventListener('change', (event) => {
      this.state.setLevelConfig({ timeLimitSec: Number((event.target as HTMLInputElement).value) });
    });
    node.querySelector<HTMLInputElement>('input[data-field="background"]')?.addEventListener('change', (event) => {
      this.state.setLevelConfig({ background: (event.target as HTMLInputElement).value });
    });
    node.querySelector<HTMLSelectElement>('select[data-field="backgroundImage"]')?.addEventListener('change', (event) => {
      this.state.setBackgroundImageConfig({ image: (event.target as HTMLSelectElement).value });
    });
    node.querySelector<HTMLInputElement>('input[data-field="parallaxX"]')?.addEventListener('change', (event) => {
      this.state.setBackgroundImageConfig({ parallaxX: Number((event.target as HTMLInputElement).value) });
    });
    node.querySelector<HTMLInputElement>('input[data-field="parallaxY"]')?.addEventListener('change', (event) => {
      this.state.setBackgroundImageConfig({ parallaxY: Number((event.target as HTMLInputElement).value) });
    });
    node.querySelector<HTMLSelectElement>('select[data-field="camera-follow"]')?.addEventListener('change', (event) => {
      const value = (event.target as HTMLSelectElement).value;
      this.state.setCameraConfig({ follow: value || undefined });
    });
    node.querySelector<HTMLInputElement>('input[data-field="camera-marginX"]')?.addEventListener('change', (event) => {
      this.state.setCameraConfig({ marginX: Number((event.target as HTMLInputElement).value) });
    });
    node.querySelector<HTMLInputElement>('input[data-field="camera-marginY"]')?.addEventListener('change', (event) => {
      this.state.setCameraConfig({ marginY: Number((event.target as HTMLInputElement).value) });
    });
  }
}
