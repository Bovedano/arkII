import Phaser from 'phaser';

/**
 * Aligns a fixed-position DOM overlay to the game canvas's actual on-screen rect, which
 * Phaser.Scale.FIT letterboxes/scales as the browser window resizes. The overlay's content
 * is authored in the 960x540 design space and scaled with CSS transform to match, so it
 * stays pixel-perfect at any window size. Returns an unbind function — the caller must call
 * it on scene shutdown, since this listens on `scene.scale` (a game-level object that
 * outlives the scene).
 */
export function fitToCanvas(scene: Phaser.Scene, root: HTMLElement): () => void {
  const apply = () => {
    const bounds = scene.scale.canvasBounds;
    const scale = bounds.width / scene.scale.baseSize.width;
    Object.assign(root.style, {
      left: `${bounds.left}px`,
      top: `${bounds.top}px`,
      width: `${scene.scale.baseSize.width}px`,
      height: `${scene.scale.baseSize.height}px`,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    });
  };
  apply();
  scene.scale.on(Phaser.Scale.Events.RESIZE, apply);
  return () => scene.scale.off(Phaser.Scale.Events.RESIZE, apply);
}
