# Game Config and Asset Loading

## Full annotated `Phaser.Game` config

```js
// config/gameConfig.js
export const gameConfig = {
  type: Phaser.AUTO,        // WebGL if available, falls back to Canvas — almost always the right choice
  width: 960,
  height: 540,
  pixelArt: true,           // disables texture smoothing; set false for non-pixel-art / hand-drawn art
  backgroundColor: '#1d1d2b',

  scale: {
    mode: Phaser.Scale.FIT,           // preserves aspect ratio with letterboxing — see SKILL.md for alternatives
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 540,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },   // omit or set to 0 for a top-down game
      debug: false,          // flip to true while developing collision, turn off before shipping
    },
  },

  scene: [], // populated in main.js with the actual Scene classes/instances
};
```

Things this deliberately does *not* leave to defaults:
- `pixelArt` — the default (`false`) smooths scaled sprites, which looks blurry/wrong for pixel art. Decide this explicitly based on the art style.
- `scale.mode` — the unset default is a fixed-size canvas that doesn't adapt to the browser window at all.
- `physics.arcade.debug` — worth toggling on during collision work, easy to forget to turn off; consider driving it from a `?debug=1` URL param or an env var instead of hand-editing before every commit.

## Loading assets

```js
// PreloadScene.js
preload() {
  // Progress bar wiring — show the player something is happening
  const bar = this.add.rectangle(480, 270, 4, 32, 0xffffff);
  this.load.on('progress', (value) => { bar.width = 4 + 460 * value; });

  // Atlas: one PNG + one JSON describing frame regions — prefer this over many load.image() calls
  this.load.atlas('player-atlas', 'assets/atlases/player.png', 'assets/atlases/player.json');
  this.load.atlas('enemies-atlas', 'assets/atlases/enemies.png', 'assets/atlases/enemies.json');

  // One-off large image that doesn't benefit from atlasing
  this.load.image('background', 'assets/images/background.png');

  // Audio — prefer an audio sprite (one file, multiple named cues) for short SFX to cut HTTP requests
  this.load.audioSprite('sfx', 'assets/audio/sfx.json', ['assets/audio/sfx.ogg', 'assets/audio/sfx.mp3']);
  this.load.audio('music', ['assets/audio/theme.ogg', 'assets/audio/theme.mp3']);

  // Tilemap (Tiled JSON export) + the tileset image it references
  this.load.tilemapTiledJSON('level1', 'assets/tilemaps/level1.json');
  this.load.image('tiles', 'assets/tilemaps/tileset.png');
}

create() {
  this.scene.start('Menu');
}
```

Provide both `.ogg` and `.mp3` (or `.m4a`) for audio — browser codec support isn't universal, and Phaser's loader picks the first format the browser supports from the array.

## Building an animation from an atlas

```js
this.anims.create({
  key: 'player-run',
  frames: this.anims.generateFrameNames('player-atlas', {
    prefix: 'run-',
    start: 0,
    end: 7,
    zeroPad: 0,
  }),
  frameRate: 12,
  repeat: -1, // loop forever
});

// later, on the sprite:
player.play('player-run');
```

Define animations once (in a scene's `create()`, or a shared `systems/animations.js` module called from a central place) rather than re-declaring the same `anims.create()` call in every scene that happens to use that sprite — `this.anims.create()` with a duplicate key is a silent no-op or overwrite depending on version, and duplicated definitions drift out of sync over time.

## Tilemaps

```js
create() {
  const map = this.make.tilemap({ key: 'level1' });
  const tileset = map.addTilesetImage('tileset-name-in-tiled', 'tiles');
  const groundLayer = map.createLayer('Ground', tileset, 0, 0);
  groundLayer.setCollisionByProperty({ collides: true });

  this.physics.add.collider(this.player, groundLayer);
}
```

Set collision via a custom property in Tiled (e.g. a `collides` boolean on the relevant tiles) rather than `setCollisionBetween` with hardcoded tile-index ranges — it survives the tileset being re-ordered or re-exported, where index ranges silently break.
