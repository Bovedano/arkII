import Phaser from 'phaser';
import { LevelLoader } from '../systems/LevelLoader';
import { getLevelText } from '../levels/levelRegistry';
import { getGameState } from '../systems/GameState';
import { EventBus } from '../systems/EventBus';
import { appConfig } from '../config/appConfig';
import type { GameElementLike } from '../game-elements/core/types';
import type { LevelDefinition } from '../levels/types';
import { GEPenista } from '../game-elements/characters/GEPenista';
import { GameSession } from '../systems/GameSession';
import { Hud } from '../ui/Hud';
import { TouchInputController } from '../ui/TouchInputController';
import { LevelCompleteScreen } from '../ui/LevelCompleteScreen';

interface WithVisualAndParams extends GameElementLike {
  visual: Phaser.GameObjects.GameObject;
  params: { behavior?: string };
  trigger?: () => void;
}

interface GameSceneData {
  levelId: string;
  /** When set (editor "Probar nivel"), used instead of the registry/disk copy — always the
   *  exact in-memory edited level, even if levelId collides with a saved one. */
  levelText?: string;
  /** When true, ESC returns to the editor (with the draft restored) instead of LevelSelect. */
  testMode?: boolean;
}

export class GameScene extends Phaser.Scene {
  private static readonly FALL_MARGIN = 150;

  private levelId!: string;
  private testMode = false;
  private level!: LevelDefinition;
  private elements: GameElementLike[] = [];
  private levelEventHandler = (eventKey: string) => this.onLevelEvent(eventKey);
  private player?: GEPenista;
  private playerSpawn?: { x: number; y: number };
  private session!: GameSession;
  private hud!: Hud;
  private completed = false;

  constructor() {
    super('Game');
  }

  init(data: GameSceneData): void {
    this.levelId = data.levelId;
    this.testMode = data.testMode ?? false;
  }

  create(data: GameSceneData): void {
    this.elements = [];
    this.level = LevelLoader.parse(data.levelText ?? getLevelText(this.levelId));
    this.elements = LevelLoader.instantiate(this, this.level);

    const player = this.elements.find((el): el is GEPenista => el instanceof GEPenista);
    this.setupCamera(player);
    if (player) {
      this.wireBehaviorInteractions(player);
    }

    this.player = player;
    const spawnDef = this.level.elements.find((el) => el.type === 'Penista');
    if (spawnDef) this.playerSpawn = { x: spawnDef.x, y: spawnDef.y };
    this.session = new GameSession(this.level);
    this.hud = new Hud(this);
    if (this.wantsTouchControls() && player) {
      new TouchInputController(this, player.getCursors());
    }

    EventBus.on('level-event', this.levelEventHandler);
    this.events.once('shutdown', () => EventBus.off('level-event', this.levelEventHandler));

    this.input.keyboard?.once('keydown-ESC', () => {
      if (this.testMode) {
        this.scene.start('LevelEditor', { resumeDraft: true });
      } else {
        this.scene.start('LevelSelect');
      }
    });

    if (appConfig.dev) {
      this.input.keyboard?.on('keydown-F9', () => this.toggleDebugBorders());
    }
  }

  update(time: number, delta: number): void {
    if (this.completed) return;

    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].update?.(time, delta);
    }

    const timedOut = this.session.tick(delta);
    this.checkFall();
    if (timedOut) this.handleLifeLoss();
    this.hud.refresh(this.session.snapshot());
  }

  /** Loses a life once the player falls below the level's bottom edge (no floor caught them). */
  private checkFall(): void {
    if (!this.player) return;
    if (this.player.visual.y > this.level.config.height + GameScene.FALL_MARGIN) this.handleLifeLoss();
  }

  /** Shared by falling and the clock running out: subtracts a life, resets the clock/position,
   *  and returns to LevelSelect once lives run out. */
  private handleLifeLoss(): void {
    if (!this.player) return;
    const gameOver = this.session.loseLife();
    if (this.playerSpawn) this.player.respawnAt(this.playerSpawn.x, this.playerSpawn.y);
    if (gameOver) this.scene.start('LevelSelect');
  }

  /** True on real touch devices, and also as a fallback on narrow windows — Chrome DevTools'
   *  "Responsive" device-toolbar mode doesn't set navigator.maxTouchPoints unless a named
   *  device preset is picked, so relying on device.input.touch alone makes the controls
   *  untestable there. Real tablets/phones already satisfy device.input.touch regardless of
   *  width, so this only ever adds cases, never hides the controls on an actual touch device. */
  private wantsTouchControls(): boolean {
    const NARROW_WINDOW_PX = 900;
    return this.sys.game.device.input.touch || window.innerWidth <= NARROW_WINDOW_PX;
  }

  /** Points the camera at the configured `camera.follow` element, falling back to the main
   *  character (Penista). The deadzone margin (if any) lets the target roam within it before
   *  the camera scrolls; `setBounds` (set in LevelLoader) still clamps scrolling to the level. */
  private setupCamera(player: GEPenista | undefined): void {
    const cameraConfig = this.level.config.camera;
    const followId = cameraConfig?.follow;
    const followTarget = followId
      ? ((this.elements.find((el) => el.id === followId) as WithVisualAndParams | undefined)?.visual ??
        player?.visual)
      : player?.visual;
    if (!followTarget) return;

    this.cameras.main.startFollow(followTarget, true);
    if (cameraConfig?.marginX || cameraConfig?.marginY) {
      this.cameras.main.setDeadzone(cameraConfig.marginX ?? 0, cameraConfig.marginY ?? 0);
    }
  }

  /** Wires collision/overlap between the player and every other element, driven by `behavior`. */
  private wireBehaviorInteractions(player: GEPenista): void {
    for (const el of this.elements) {
      if (el === player) continue;
      const withVisual = el as unknown as WithVisualAndParams;
      if (!withVisual.visual) continue;
      const behavior = withVisual.params?.behavior;
      if (behavior === 'solid') {
        this.physics.add.collider(player.visual, withVisual.visual);
      } else if (behavior === 'sensor') {
        this.physics.add.overlap(player.visual, withVisual.visual, () => withVisual.trigger?.());
      } else if (behavior === 'damage') {
        this.physics.add.overlap(player.visual, withVisual.visual, () => this.handleLifeLoss());
      } else if (behavior === 'semisolid') {
        this.physics.add.collider(player.visual, withVisual.visual, undefined, () =>
          this.isLandingFromAbove(player, withVisual.visual),
        );
      }
    }
  }

  /** One-way platform check for `semisolid`: only collide while the player is falling and was
   *  still above the platform's top last step — lets them jump up through it from below but
   *  land on top of it. */
  private isLandingFromAbove(player: GEPenista, platform: Phaser.GameObjects.GameObject): boolean {
    const playerBody = player.visual.body as Phaser.Physics.Arcade.Body;
    const platformBody = (platform as Phaser.Types.Physics.Arcade.GameObjectWithBody).body as
      | Phaser.Physics.Arcade.Body
      | Phaser.Physics.Arcade.StaticBody;
    return playerBody.velocity.y >= 0 && playerBody.prev.y + playerBody.height <= platformBody.top;
  }

  /** Toggles the Arcade physics debug borders (F9, dev mode only) without needing a scene
   *  restart — Phaser only allocates the debug Graphics lazily, so the first toggle-on
   *  creates it if `gameConfig.physics.arcade.debug` started out false. */
  private toggleDebugBorders(): void {
    const world = this.physics.world;
    if (world.drawDebug) {
      world.drawDebug = false;
      world.debugGraphic?.clear();
    } else if (world.debugGraphic) {
      world.drawDebug = true;
    } else {
      world.createDebugGraphic();
    }
  }

  private onLevelEvent(eventKey: string): void {
    if (eventKey.endsWith(':collected')) this.session.collect();
    if (eventKey.endsWith(':hazard')) this.handleLifeLoss();

    const gameState = getGameState(this.registry);
    for (const sub of this.level.sublevels ?? []) {
      if (sub.unlockOn === eventKey) gameState.unlockSublevel(sub.id);
    }

    if (!this.completed && this.session.total > 0 && this.session.collected >= this.session.total) {
      this.onLevelComplete();
    }
  }

  /** Freezes gameplay, persists the completion/best-time, and shows the HTML overlay. */
  private onLevelComplete(): void {
    this.completed = true;
    this.physics.pause();

    const gameState = getGameState(this.registry);
    const timeSec = Math.round(this.session.elapsedSec);
    const { isNewRecord, bestTimeSec } = gameState.recordCompletion(this.levelId, timeSec);

    new LevelCompleteScreen(this, {
      levelTitle: this.level.title,
      timeSec,
      isNewRecord,
      bestTimeSec,
      onRetry: () => this.scene.start('Game', { levelId: this.levelId }),
      onLevelSelect: () => this.scene.start('LevelSelect'),
    });
  }
}
