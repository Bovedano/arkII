# Project Structure (real project, not a one-file prototype)

## Recommended layout

```
my-game/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── assets/           # served as-is, referenced by path at runtime
│       ├── images/
│       ├── atlases/       (spritesheet.png + spritesheet.json pairs)
│       ├── audio/
│       └── tilemaps/
└── src/
    ├── main.js            # Phaser.Game bootstrap only — config + scene list
    ├── scenes/
    │   ├── BootScene.js    # loads only what's needed to show a progress bar
    │   ├── PreloadScene.js # loads the rest of the game's assets, shows progress
    │   ├── MenuScene.js
    │   ├── GameScene.js
    │   ├── HUDScene.js     # runs in parallel with GameScene via scene.launch
    │   └── GameOverScene.js
    ├── objects/            # custom GameObject/Sprite subclasses (Player, Enemy, Bullet)
    ├── systems/            # things that aren't GameObjects: spawner, save system, audio manager
    └── config/
        └── gameConfig.js   # the Phaser.Game config object, imported by main.js
```

## Why a Boot → Preload split

`BootScene` loads just enough (a loading-bar image, maybe a logo) to render *something* immediately, then starts `PreloadScene`, which loads the bulk of the game's assets with a visible progress bar. If you load everything in one scene before showing anything, the player stares at a blank white/black screen with no feedback — looks broken even when it isn't.

```js
// BootScene.js
export default class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  preload() {
    this.load.image('loading-bar', 'assets/images/loading-bar.png');
  }
  create() { this.scene.start('Preload'); }
}
```

## Custom GameObject classes belong in objects/, not inline in a Scene

Once a sprite needs more than a couple of custom fields/methods (health, an attack pattern, a state machine), pull it into its own class rather than building it up ad hoc inside `create()`:

```js
// objects/Player.js
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-atlas', 'idle-0');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.health = 100;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) this.die();
  }

  die() {
    this.scene.events.emit('player-died');
    this.destroy();
  }
}
```

This keeps `GameScene.create()` readable (`this.player = new Player(this, 100, 100)`) instead of a wall of property assignments, and makes the entity testable/reusable across scenes.

## main.js should only bootstrap

Resist the urge to put game logic in `main.js`. It should do exactly one thing: build the config and start the game.

```js
// main.js
import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig.js';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import HUDScene from './scenes/HUDScene.js';

new Phaser.Game({
  ...gameConfig,
  scene: [BootScene, PreloadScene, MenuScene, GameScene, HUDScene],
});
```

## Prototype layout (when Step 0 says "quick prototype")

Just one file is fine — don't force the structure above onto something disposable:

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Prototype</title></head>
<body>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
<script>
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: { preload, create, update },
  };
  new Phaser.Game(config);

  function preload() { /* ... */ }
  function create() { /* ... */ }
  function update(time, delta) { /* ... */ }
</script>
</body>
</html>
```
