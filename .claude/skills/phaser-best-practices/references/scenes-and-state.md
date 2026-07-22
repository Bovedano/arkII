# Scenes, Transitions, and Where State Lives

## Passing data when starting a scene

Pass data explicitly through `scene.start(key, data)` rather than reaching into another scene instance or stashing values on `window`/globals:

```js
// From MenuScene
this.scene.start('Game', { level: 3, difficulty: 'hard' });

// In GameScene
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }
  init(data) {
    this.level = data.level;
    this.difficulty = data.difficulty;
  }
}
```

`init(data)` runs every time the scene starts (even restarts), which makes it the right place to reset per-run state — don't put that in the constructor, which only runs once when the Scene object is first created and never again for the life of the `Phaser.Game` instance.

## Parallel scenes for UI/HUD

Instead of drawing HUD elements inside the gameplay scene (which couples UI layout to gameplay code and makes both harder to change independently), run a separate scene alongside it:

```js
// GameScene.create()
this.scene.launch('HUD');

// Communicate via the scene's event emitter, not direct field access
this.events.emit('score-changed', this.score);
```

```js
// HUDScene listens on the scene it's paired with
class HUDScene extends Phaser.Scene {
  constructor() { super('HUD'); }
  create() {
    const gameScene = this.scene.get('Game');
    gameScene.events.on('score-changed', (score) => {
      this.scoreText.setText(`Score: ${score}`);
    });
  }
}
```

This also means pausing/resuming gameplay (e.g. for a pause menu) doesn't have to pause the HUD rendering, and vice versa.

## Where should persistent game state actually live?

Scene instance fields (`this.score`, `this.playerHealth`) are fine for state that's genuinely scoped to that scene's lifetime. They're the wrong place for state that needs to survive a scene restart or be read by multiple scenes — that state tends to accidentally reset or desync when scenes restart.

Options, roughly in order of how much structure they need:

1. **`this.registry`** (a `Phaser.Game`-wide data store, available identically from every scene as `this.registry`) — good for simple global values: current score, selected character, settings. `this.registry.set('score', 0)`, read anywhere with `this.registry.get('score')`. Emits `changedata` events too, so UI can react without polling.
2. **A dedicated non-Scene class** (e.g. `systems/GameState.js`, a plain JS class or a small store) — better once state has structure/behavior beyond flat key-value (e.g. an inventory system with add/remove/stack logic). Instantiate it once in `main.js` or a bootstrap scene and pass references, or import a singleton module.
3. **`localStorage`** — only for things that should survive a full page reload (save games, settings, high scores). Don't use it as your live in-memory state store; read it once at startup into the registry or a state object, write to it on save points, not every frame.

A common bug pattern: score/health stored as scene fields, then the scene gets restarted (`this.scene.restart()`) for a new level, and the field silently resets because the constructor/`init` ran again. If state needs to survive that, it belongs in the registry or a state object outside the scene, not on `this`.

## Scene transitions and cleanup

`this.scene.start()` shuts down the current scene (fires `shutdown`) and starts the new one. Anything the scene set up that isn't automatically torn down by Phaser — a `setInterval`, a DOM event listener attached outside Phaser's input system, a WebSocket — needs manual cleanup in a `shutdown` handler:

```js
create() {
  this.events.on('shutdown', () => {
    this.someInterval && clearInterval(this.someInterval);
  });
}
```

Phaser-managed things (game objects, its own input listeners, tweens, timers created via `this.time.addEvent`) are cleaned up automatically on scene shutdown — you generally don't need to null them out yourself.