import Phaser from 'phaser';
import { EditorState } from '../editor/EditorState';
import { EditorCanvas } from '../editor/EditorCanvas';
import { EditorPalette } from '../editor/EditorPalette';
import { EditorPropertyPanel } from '../editor/EditorPropertyPanel';
import { LevelConfigPanel } from '../editor/LevelConfigPanel';
import { SublevelPanel } from '../editor/SublevelPanel';
import { LevelExport } from '../editor/LevelExport';
import { LevelLoader } from '../systems/LevelLoader';
import { LEVEL_REGISTRY } from '../levels/levelRegistry';

const CANVAS_RECT = { x: 170, y: 90, width: 580, height: 380 };

export class LevelEditorScene extends Phaser.Scene {
  private state!: EditorState;
  private canvas!: EditorCanvas;
  private settingStart = false;
  private setStartButton?: Phaser.GameObjects.Text;

  constructor() {
    super('LevelEditor');
  }

  create(): void {
    this.showLevelPicker();
  }

  private showLevelPicker(): void {
    const modal = this.add.dom(480, 270).setOrigin(0.5, 0.5);
    const options = LEVEL_REGISTRY.map((l) => `<option value="${l.id}">${l.title} (${l.id})</option>`).join('');
    modal.createFromHTML(`
      <div style="width:260px;font:14px sans-serif;color:#eee;background:#20202c;padding:16px;border:1px solid #555;display:flex;flex-direction:column;gap:8px;">
        <strong>Editor de Niveles</strong>
        <label>Cargar nivel existente
          <select data-field="level">
            <option value="">-- Nuevo nivel --</option>
            ${options}
          </select>
        </label>
        <button data-action="start">Comenzar</button>
      </div>
    `);
    const node = modal.node as HTMLElement;
    node.querySelector('button[data-action="start"]')?.addEventListener('click', () => {
      const levelId = node.querySelector<HTMLSelectElement>('select[data-field="level"]')?.value ?? '';
      modal.destroy();
      this.buildEditor(levelId || undefined);
    });
  }

  private buildEditor(levelId?: string): void {
    const meta = levelId ? LEVEL_REGISTRY.find((l) => l.id === levelId) : undefined;
    this.state = meta ? new EditorState(LevelLoader.parse(meta.text)) : EditorState.blank(`level-${Date.now().toString(36)}`);

    this.physics.world.drawDebug = false;

    this.add
      .text(20, 12, '< Menú', { fontSize: '16px', color: '#cccccc' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('MainMenu'));

    this.add
      .text(180, 12, 'Cambiar nivel', { fontSize: '16px', color: '#cccccc' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.restart());

    this.add.text(480, 12, 'Editor de Niveles', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5, 0);

    this.canvas = new EditorCanvas(this, this.state, CANVAS_RECT);
    new EditorPalette(this, this.state, this.canvas, { x: 10, y: 90, width: 150 });
    new EditorPropertyPanel(this, this.state, 760, 90);
    new LevelConfigPanel(this, this.state, 760, 250);
    new SublevelPanel(this, this.state, 760, 420);

    this.setStartButton = this.add
      .text(170, 480, 'Establecer punto de partida', {
        fontSize: '14px',
        color: '#4ac95a',
        backgroundColor: '#20202c',
        padding: { x: 6, y: 4 },
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.toggleSetStart());

    this.add
      .text(430, 480, 'Copiar JSON', {
        fontSize: '14px',
        color: '#ffd24a',
        backgroundColor: '#20202c',
        padding: { x: 6, y: 4 },
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => void LevelExport.copyToClipboard(this.state.level));

    this.add
      .text(560, 480, 'Descargar JSON', {
        fontSize: '14px',
        color: '#ffd24a',
        backgroundColor: '#20202c',
        padding: { x: 6, y: 4 },
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => LevelExport.download(this.state.level));

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.settingStart) return;
      if (!this.canvas.containsScreenPoint(pointer.x, pointer.y)) return;
      const { x, y } = this.canvas.screenToLevel(pointer.x, pointer.y);
      this.state.setPlayerStart(Math.round(x), Math.round(y));
      this.toggleSetStart();
    });
  }

  private toggleSetStart(): void {
    this.settingStart = !this.settingStart;
    this.setStartButton?.setColor(this.settingStart ? '#ffffff' : '#4ac95a');
    this.setStartButton?.setBackgroundColor(this.settingStart ? '#4ac95a' : '#20202c');
  }
}
