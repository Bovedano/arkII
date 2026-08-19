import Phaser from 'phaser';
import { EditorState } from '../editor/EditorState';
import { EditorCanvas } from '../editor/EditorCanvas';
import { EditorPalette } from '../editor/EditorPalette';
import { EditorPropertyPanel } from '../editor/EditorPropertyPanel';
import { EditorZoomControl } from '../editor/EditorZoomControl';
import { LevelConfigPanel } from '../editor/LevelConfigPanel';
import { SublevelPanel } from '../editor/SublevelPanel';
import { GroupPanel } from '../editor/GroupPanel';
import { LevelExport } from '../editor/LevelExport';
import { EditorDraftStore } from '../editor/EditorDraftStore';
import { EditorViewStore } from '../editor/EditorViewStore';
import { DomOverlay } from '../editor/DomOverlay';
import { EditorSidebar } from '../editor/EditorSidebar';
import { LevelLoader } from '../systems/LevelLoader';
import { LEVEL_REGISTRY } from '../levels/levelRegistry';
import type { LevelDefinition } from '../levels/types';

const CANVAS_RECT = { x: 170, y: 90, width: 770, height: 380 };
const DRAFT_OPTION_VALUE = '__draft__';

interface LevelEditorSceneData {
  /** Set when returning from "Probar nivel" (GameScene ESC) — resumes the saved draft directly. */
  resumeDraft?: boolean;
}

export class LevelEditorScene extends Phaser.Scene {
  private state!: EditorState;
  private canvas!: EditorCanvas;
  private settingStart = false;
  private setStartButton?: Phaser.GameObjects.Text;

  constructor() {
    super('LevelEditor');
  }

  create(data: LevelEditorSceneData): void {
    const draft = data?.resumeDraft ? EditorDraftStore.load() : null;
    if (draft) {
      this.buildEditor(undefined, draft);
    } else {
      this.showLevelPicker();
    }
  }

  private showLevelPicker(): void {
    const overlay = new DomOverlay(this, {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    });
    const draft = EditorDraftStore.load();
    const draftOption = draft
      ? `<option value="${DRAFT_OPTION_VALUE}">Continuar borrador guardado (${draft.title})</option>`
      : '';
    const options = LEVEL_REGISTRY.map((l) => `<option value="${l.id}">${l.title} (${l.id})</option>`).join('');
    overlay.root.innerHTML = `
      <div style="width:260px;font:14px sans-serif;color:#eee;background:#20202c;padding:16px;border:1px solid #555;display:flex;flex-direction:column;gap:8px;">
        <strong>Editor de Niveles</strong>
        <label>Cargar nivel existente
          <select data-field="level">
            ${draftOption}
            <option value="">-- Nuevo nivel --</option>
            ${options}
          </select>
        </label>
        <button data-action="start">Comenzar</button>
      </div>
    `;
    overlay.root.querySelector('button[data-action="start"]')?.addEventListener('click', () => {
      const levelId = overlay.root.querySelector<HTMLSelectElement>('select[data-field="level"]')?.value ?? '';
      overlay.root.remove();
      if (levelId === DRAFT_OPTION_VALUE) {
        this.buildEditor(undefined, EditorDraftStore.load() ?? undefined);
      } else {
        this.buildEditor(levelId || undefined);
      }
    });
  }

  private buildEditor(levelId?: string, presetLevel?: LevelDefinition): void {
    const meta = levelId ? LEVEL_REGISTRY.find((l) => l.id === levelId) : undefined;
    this.state = presetLevel
      ? new EditorState(presetLevel)
      : meta
        ? new EditorState(LevelLoader.parse(meta.text))
        : EditorState.blank(`level-${Date.now().toString(36)}`);
    this.state.onChange(() => EditorDraftStore.save(this.state.level));

    // Restore the zoom/pan/open-group the user left this level at, so returning to the
    // editor doesn't require re-zooming or re-entering a group to keep editing it.
    const savedView = EditorViewStore.load(this.state.level.id);
    if (savedView) {
      this.state.zoom = savedView.zoom;
      this.state.panX = savedView.panX;
      this.state.panY = savedView.panY;
      if (savedView.editingGroupId && this.state.level.groups?.some((g) => g.id === savedView.editingGroupId)) {
        this.state.editingGroupId = savedView.editingGroupId;
      }
    }
    const saveView = () =>
      EditorViewStore.save(this.state.level.id, {
        zoom: this.state.zoom,
        panX: this.state.panX,
        panY: this.state.panY,
        editingGroupId: this.state.editingGroupId,
      });
    this.state.onViewChange(saveView);
    this.state.onChange(saveView);

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

    // Side panels live in #editor-sidebar, a real flexbox column sibling of the game canvas
    // (see EditorSidebar) — not scene.add.dom(), since Phaser's DOM Element Game Objects
    // misplace themselves horizontally once the canvas is scaled by Phaser.Scale.FIT to
    // anything other than 1:1 (i.e. almost every real browser window).
    const sidebar = new EditorSidebar(this);
    new EditorPropertyPanel(this.state, sidebar.root);
    new LevelConfigPanel(this.state, sidebar.root);
    new EditorZoomControl(this.state, sidebar.root);
    new SublevelPanel(this.state, sidebar.root);
    new GroupPanel(this.state, sidebar.root);

    this.setStartButton = this.add
      .text(170, 480, 'Establecer punto de partida', {
        fontSize: '14px',
        color: '#4ac95a',
        backgroundColor: '#20202c',
        padding: { x: 6, y: 4 },
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        // Setting a spawn point while editing a group would write it into the shared group
        // definition, cloning it into every placement of that group — see EditorState.setPlayerStart.
        if (this.state.editingGroupId) return;
        this.toggleSetStart();
      });

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

    this.add
      .text(170, 510, 'Probar nivel', {
        fontSize: '14px',
        color: '#4ac9ff',
        backgroundColor: '#20202c',
        padding: { x: 6, y: 4 },
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        EditorDraftStore.save(this.state.level);
        this.scene.start('Game', {
          levelId: this.state.level.id,
          levelText: JSON.stringify(this.state.level),
          testMode: true,
        });
      });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.settingStart) return;
      if (!this.canvas.containsScreenPoint(pointer.x, pointer.y)) return;
      const { x, y } = this.canvas.screenToLevel(pointer.x, pointer.y);
      this.state.setPlayerStart(Math.round(x), Math.round(y));
      this.toggleSetStart();
    });

    this.bindUndoRedoShortcuts();
  }

  /** Ctrl+Z / Ctrl+Y for undo/redo. Listens on `window` (not Phaser's keyboard plugin) since
   *  most of the editor UI — including text inputs where native undo should keep working — is
   *  real DOM, not canvas: bails out when focus is in an editable field. */
  private bindUndoRedoShortcuts(): void {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

      if (event.key.toLowerCase() === 'z') {
        event.preventDefault();
        this.state.undo();
      } else if (event.key.toLowerCase() === 'y') {
        event.preventDefault();
        this.state.redo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    this.events.once('shutdown', () => window.removeEventListener('keydown', onKeyDown));
  }

  private toggleSetStart(): void {
    this.settingStart = !this.settingStart;
    this.setStartButton?.setColor(this.settingStart ? '#ffffff' : '#4ac95a');
    this.setStartButton?.setBackgroundColor(this.settingStart ? '#4ac95a' : '#20202c');
  }
}
