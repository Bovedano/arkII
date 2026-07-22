---
name: phaser-best-practices
description: Best practices for building an HTML5/JavaScript game with the Phaser framework (Phaser 3, and Phaser 4 where it differs) — project setup, Scene architecture, asset loading, game state, input, performance, and responsive scaling. Use this whenever the user is starting a new Phaser game, adding a Scene/level/entity to an existing one, wiring up physics/input/tilemaps, debugging performance or scaling issues, or asking "how should I structure this" for a Phaser project — even if they don't say "best practices" explicitly.
---

# Phaser Game Development

Phaser projects tend to go wrong in a few predictable ways: everything lives in one giant Scene, `update()` allocates new objects every frame and stalls the garbage collector, assets get loaded ad-hoc instead of atlased, and the canvas doesn't scale sensibly across screen sizes. This skill exists to catch those before they're baked into the architecture.

Before writing code, figure out which situation applies — it changes almost everything downstream.

## Step 0: Prototype or real project?

**Quick prototype / jam / one-off demo** — single `index.html`, Phaser via CDN `<script>` tag, all code in one or two files. Don't bother with a bundler or module system; the overhead isn't worth it for something you'll throw away or that stays under ~500 lines.

**Real project** (anything you'll keep working on, add levels to, or ship) — use a bundler (Vite is the standard choice for Phaser today: instant dev server, ES modules, trivial config) and split code into modules from the start. Retrofitting structure onto a 2000-line `game.js` is much more painful than starting with it.

If unsure which the user wants, ask — it determines whether you reach for `npm create vite@latest` or just write a single HTML file.

For the real-project layout, see [references/project-structure.md](references/project-structure.md).

## Core architecture

### Scenes are the unit of organization, not the whole game

A `Phaser.Scene` should map to one coherent piece of the game — a menu, a level, a HUD overlay, a pause screen — not the entire thing. Symptoms of a Scene that's grown too big: it has more than one "mode" of behavior gated by flags, or you find yourself commenting out chunks of `update()` to test one feature.

Run overlapping scenes in parallel instead of cramming them together — e.g. a `HUDScene` launched alongside `GameScene` via `this.scene.launch('HUD')`, communicating over events rather than reaching into each other's fields directly. This keeps UI code from tangling with gameplay code.

Each scene's three lifecycle methods have a specific job — don't blur them:
- `preload()` — only asset loading (`this.load.image/spritesheet/atlas/audio`). No game logic.
- `create()` — build the initial world once: sprites, groups, physics bodies, input listeners, the state needed for `update()` to run. Runs once per scene start.
- `update(time, delta)` — per-frame logic only. Runs 60×/sec (or whatever the target is) — anything expensive or allocation-heavy here compounds fast.

See [references/scenes-and-state.md](references/scenes-and-state.md) for scene transitions, passing data between scenes, and where game state should actually live (it's usually *not* scattered across scene instance fields).

### Don't allocate in the hot loop

The single most common perf bug in Phaser games: creating new objects/arrays/closures inside `update()`. Each frame that does this pressures the garbage collector, and GC pauses show up as visible stutter — worse on mobile. Instead:

- Pre-allocate reusable objects (a scratch `Phaser.Math.Vector2`, a temp array) outside `update()` and mutate them in place.
- Use **object pools** (or `Phaser.GameObjects.Group` with `runChildUpdate`/`createMultiple`) for anything spawned repeatedly — bullets, particles, enemies — instead of `new`-ing and destroying. Recycle with `setActive(false).setVisible(false)` and reuse rather than `.destroy()`.
- Avoid `.forEach` with a fresh arrow function allocated every frame inside `update()` if it's iterating a large collection every tick; a plain `for` loop over `group.getChildren()` avoids the closure allocation.

More in [references/performance.md](references/performance.md) — covers texture atlases, physics body counts, and draw-call batching too.

### Load assets as atlases, not loose files

Loading dozens of individual PNGs means dozens of HTTP requests and breaks texture batching (the renderer can't batch draws across different textures, so more textures = more draw calls = worse performance). Pack related sprites into a **texture atlas** (TexturePacker, or the free Free Texture Packer) and load it with `this.load.atlas(key, pngURL, jsonURL)`. Keep loose `this.load.image()` calls for one-off large backgrounds where atlasing doesn't help.

Show loading progress for anything beyond a trivial asset set — `this.load.on('progress', ...)` — rather than a blank screen; players bounce off unresponsive-looking load screens.

### Physics: pick the right system and don't over-request it

- **Arcade Physics** — fast, AABB-only, good enough for the vast majority of 2D games (platformers, top-down, shmups). Default choice.
- **Matter.js** — only reach for this if you need real polygon collision, rotation-aware physics, constraints/joints, or ragdoll-ish behavior. It's heavier and the API is a bigger surface area.

Within Arcade Physics, use `this.physics.add.group()` for collections of similar objects (bullets, coins) so you can `collider`/`overlap` the whole group at once instead of registering N individual colliders — cheaper to set up and cheaper to check.

### Input

Register input listeners in `create()`, not `update()` (re-registering every frame leaks listeners). Poll cursor/key *state* inside `update()` (`cursors.left.isDown`), but attach one-shot event listeners (`this.input.keyboard.on('keydown-SPACE', ...)`) once, in `create()`.

For touch/mobile, don't assume mouse-only input works — test with `this.input.addPointer()` for multi-touch, and keep tap targets generously sized.

### Responsive scaling

Decide the scale mode deliberately in the game config instead of leaving it at the default:

```js
scale: {
  mode: Phaser.Scale.FIT,       // or ENVELOP, RESIZE — pick based on whether letterboxing is acceptable
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 800,
  height: 600
}
```

`FIT` letterboxes to preserve aspect ratio (best for pixel-art games where distortion is visually obvious). `RESIZE` fills the container and you handle layout dynamically — needed if you want UI to reflow rather than just scale. Don't leave this unset and then patch scaling issues with manual CSS transforms later.

For pixel art specifically, set `pixelArt: true` in the game config (disables texture smoothing so scaled sprites stay crisp).

## Config & bootstrapping

See [references/assets-and-config.md](references/assets-and-config.md) for a complete, commented `Phaser.Game` config example (renderer choice, physics config, scale, scene list) and the asset-loading patterns (atlases, audio sprites, tilemaps) referenced above.

## Debugging

- Arcade Physics debug overlay: `physics: { arcade: { debug: true } }` in config — draws hitboxes and velocity vectors. Turn off before shipping.
- Watch actual frame time, not just the browser's FPS counter: `this.game.loop.actualFps` or a small custom on-screen counter, since a "60 FPS" reading can still hide frame-time spikes.
- `console.log`-driven debugging of Scene lifecycle is fine early on, but for anything with several scenes, prefer the Phaser Scene events (`this.events.on('shutdown', ...)`, etc.) so you can see *when* a scene actually tears down — this is a common source of "why is this sprite still here" / "why did this listener fire twice" bugs, caused by a scene restarting without cleaning up its own listeners.

## When reviewing existing Phaser code

Check for these specific smells, roughly in order of how often they cause real problems:
1. Object/array allocation inside `update()`.
2. A single Scene handling multiple unrelated responsibilities (gameplay + UI + pause menu all in one).
3. Individual `this.load.image()` calls for what should be one atlas.
4. Colliders/overlaps registered per-object instead of per-group.
5. No scale config (default 1:1 canvas that doesn't adapt to viewport).
6. Input listeners re-registered in `update()` instead of once in `create()`.
