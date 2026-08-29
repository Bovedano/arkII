/** Shared fullscreen toggle used by the HUD and every menu overlay. */
export function toggleFullscreen(): void {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

/**
 * Appends a top-right "⛶" fullscreen button to a menu overlay root and wires it to
 * {@link toggleFullscreen}. Mirrors the HUD's `.hud-fullscreen` control so every screen
 * exposes the same affordance. The button positions itself absolutely, so the overlay
 * root must be a positioned element (all menu overlays are `position: fixed`).
 */
export function mountFullscreenButton(root: HTMLElement): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'menu-fullscreen';
  btn.setAttribute('aria-label', 'Pantalla completa');
  btn.textContent = '⛶';
  btn.addEventListener('click', toggleFullscreen);
  root.appendChild(btn);
  return btn;
}
