import Phaser from 'phaser';

/**
 * On mobile browsers the layout viewport settles asynchronously after a
 * resize/orientation change (address-bar show/hide animation), so Phaser's
 * own resize polling can read the container mid-transition and never
 * re-check afterwards, leaving the canvas fitted to a stale size. Force a
 * few explicit re-fits as the transition completes.
 */
export function forceRescaleOnResize(game: Phaser.Game): void {
  const rescale = () => {
    game.scale.getParentBounds();
    game.scale.refresh();
  };

  const rescaleWithSettleDelays = () => {
    rescale();
    [150, 350, 600].forEach((delay) => window.setTimeout(rescale, delay));
  };

  window.addEventListener('resize', rescaleWithSettleDelays);
  window.addEventListener('orientationchange', rescaleWithSettleDelays);
}
