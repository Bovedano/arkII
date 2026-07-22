import Phaser from 'phaser';
import type { EditorState } from './EditorState';

/** Form for the level's own metadata/config (id, title, size, gravity, background). */
export class LevelConfigPanel {
  private dom: Phaser.GameObjects.DOMElement;

  constructor(
    scene: Phaser.Scene,
    private state: EditorState,
    x: number,
    y: number,
  ) {
    this.dom = scene.add.dom(x, y).setOrigin(0, 0);
    this.render();
  }

  private render(): void {
    const { level } = this.state;
    this.dom.createFromHTML(`
      <div style="width:190px;font:12px sans-serif;color:#eee;display:flex;flex-direction:column;gap:4px;background:#20202c;padding:8px;border:1px solid #444;">
        <strong>Nivel</strong>
        <label style="display:flex;justify-content:space-between;">Id <input type="text" data-field="id" value="${level.id}" style="width:100px;" /></label>
        <label style="display:flex;justify-content:space-between;">Título <input type="text" data-field="title" value="${level.title}" style="width:100px;" /></label>
        <label style="display:flex;justify-content:space-between;">Ancho <input type="number" data-field="width" value="${level.config.width}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Alto <input type="number" data-field="height" value="${level.config.height}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Gravedad <input type="number" data-field="gravity" value="${level.config.gravity}" style="width:70px;" /></label>
        <label style="display:flex;justify-content:space-between;">Fondo <input type="color" data-field="background" value="${level.config.background}" /></label>
      </div>
    `);

    const node = this.dom.node as HTMLElement;
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
    node.querySelector<HTMLInputElement>('input[data-field="background"]')?.addEventListener('change', (event) => {
      this.state.setLevelConfig({ background: (event.target as HTMLInputElement).value });
    });
  }
}
