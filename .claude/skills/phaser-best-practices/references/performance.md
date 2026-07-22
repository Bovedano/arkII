# Performance

Most Phaser performance problems fall into one of these buckets. Diagnose by category before optimizing blindly.

## 1. Garbage collection pressure from `update()`

Anything allocated fresh every frame (`{}`, `[]`, `new Vector2()`, a closure passed to `.forEach`/`.map`) becomes garbage almost immediately, and V8's GC has to reclaim it. At 60fps that's up to 60 allocation+collection cycles a second per hot spot — the collections eventually cause a pause that shows up as a stutter, and it gets worse the more objects are on screen.

Fixes:
- Keep a scratch object as a scene/class field and mutate it: `this._tmpVec.set(x, y)` instead of `new Phaser.Math.Vector2(x, y)` inside `update()`.
- Replace `array.forEach(x => ...)` in hot paths with a plain `for` loop — the arrow function passed to `forEach` is itself an allocation if it closes over anything, and `for` avoids the per-call overhead of `forEach` entirely.
- Avoid `.filter()`/`.map()` chains inside `update()` — each intermediate call allocates a new array. Do it in a single pass with a `for` loop if it runs every frame.

## 2. Too many draw calls (texture/atlas fragmentation)

The WebGL renderer batches consecutive draw calls that share a texture. Every time the renderer has to switch textures, the batch breaks and a new draw call starts. Loading 30 individual sprite images means potentially 30 separate textures and 30 draw calls even if only a few pixels are on screen; packing them into one atlas means one texture and (often) one draw call for all of them.

- Pack related sprites (player, enemies, items, UI icons) into one or a small number of atlases with TexturePacker or Free Texture Packer.
- Keep unrelated large one-off images (full backgrounds) separate — atlasing gains nothing there and bloats the atlas.
- If profiling shows draw calls as the bottleneck (check via browser dev tools' performance panel, or `game.renderer.drawCount` if available on the renderer type in use), that's the fix — not fewer sprites, but fewer distinct textures.

## 3. Physics body count

Arcade Physics is cheap per-body but not free. Symptoms: frame time scales with enemy/bullet count specifically, and profiling shows time in the physics step.

- Use `physics.add.group()` and a single `physics.add.collider(groupA, groupB)` instead of colliders registered per-pair — Phaser's broadphase already narrows the pairs to check; you don't need to (and shouldn't) manually loop and register individual collider pairs.
- Deactivate/pool bodies rather than creating+destroying (`setActive(false)`, `body.enable = false`) for anything spawned and despawned frequently (bullets, particles-as-sprites).
- If a body doesn't need to move (static terrain), use `physics.add.staticGroup()` — static bodies skip velocity/position integration entirely.

## 4. Texture size and GPU memory

Oversized textures (a 2048×2048 atlas when the visible sprites only need 512×512 worth of pixels) waste GPU memory and upload bandwidth, which matters especially on mobile/low-end devices. Keep atlas dimensions proportional to actual on-screen sprite sizes, and prefer power-of-two dimensions (512, 1024, 2048) for broadest compatibility, even though modern WebGL doesn't strictly require it.

## 5. Object pooling pattern

For anything spawned/destroyed repeatedly and rapidly (bullets, hit-effects, pickups):

```js
class BulletPool {
  constructor(scene, size = 50) {
    this.group = scene.physics.add.group({
      classType: Bullet,
      maxSize: size,
      runChildUpdate: true,
    });
  }

  fire(x, y, velocityX, velocityY) {
    const bullet = this.group.get(x, y); // reuses a dead one if available, or creates up to maxSize
    if (!bullet) return; // pool exhausted — either grow it or drop the shot
    bullet.fire(x, y, velocityX, velocityY);
  }
}

class Bullet extends Phaser.Physics.Arcade.Sprite {
  fire(x, y, vx, vy) {
    this.setPosition(x, y);
    this.setActive(true).setVisible(true);
    this.body.enable = true;
    this.setVelocity(vx, vy);
  }

  deactivate() {
    this.setActive(false).setVisible(false);
    this.body.enable = false;
  }
}
```

`group.get()` pulls a recycled inactive member instead of creating a new instance, which is the whole point — no allocation on the hot path.

## Measuring before optimizing

Don't guess — the browser's Performance panel (record while the stutter happens, look for long tasks and GC entries) tells you which of the above actually applies. A common mistake is atlasing everything preemptively when the real bottleneck was an allocation in `update()`, or vice versa. Profile first, then apply the matching fix.
