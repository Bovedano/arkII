import Phaser from 'phaser';

export const PENISTA_TEXTURE_KEYS = {
  runEast: [0, 1, 2, 3].map((i) => `penista-run-east-${i}`),
  runWest: [0, 1, 2, 3].map((i) => `penista-run-west-${i}`),
  jumpEast: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `penista-jump-east-${i}`),
  jumpWest: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `penista-jump-west-${i}`),
};

export const PENISTA_IDLE_KEYS = {
  east: 'penista-idle-east',
  west: 'penista-idle-west',
};

/** Front-facing (camera-facing) pose shown during the Mario-style death bounce — the only
 *  non-profile Penista sprite, source art is 124x124 vs. the 48x68 profile frames. */
export const PENISTA_DEATH_FRONT_KEY = 'penista-death-front';

export const PENISTA_ANIM_KEYS = {
  runEast: 'penista-run-east',
  runWest: 'penista-run-west',
  jumpEast: 'penista-jump-east',
  jumpWest: 'penista-jump-west',
};

/**
 * Defines every Penista animation exactly once. Called from PreloadScene.create() —
 * per the phaser-best-practices skill, animations must be defined in a single shared
 * place, not re-declared per scene (a duplicate `anims.create()` key silently no-ops).
 */
export function registerPenistaAnimations(scene: Phaser.Scene): void {
  scene.anims.create({
    key: PENISTA_ANIM_KEYS.runEast,
    frames: PENISTA_TEXTURE_KEYS.runEast.map((key) => ({ key })),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: PENISTA_ANIM_KEYS.runWest,
    frames: PENISTA_TEXTURE_KEYS.runWest.map((key) => ({ key })),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: PENISTA_ANIM_KEYS.jumpEast,
    frames: PENISTA_TEXTURE_KEYS.jumpEast.map((key) => ({ key })),
    frameRate: 14,
    repeat: 0,
  });
  scene.anims.create({
    key: PENISTA_ANIM_KEYS.jumpWest,
    frames: PENISTA_TEXTURE_KEYS.jumpWest.map((key) => ({ key })),
    frameRate: 14,
    repeat: 0,
  });
}

export const BARBACOA_HUMEANTE_TEXTURE_KEYS = [0, 1, 2, 3, 4].map((i) => `barbacoa-humeante-${i}`);
export const BARBACOA_HUMEANTE_ANIM_KEY = 'barbacoa-humeante-flicker';

/** Registers the looping flame-flicker animation, called once from PreloadScene.create(). */
export function registerBarbacoaHumeanteAnimations(scene: Phaser.Scene): void {
  scene.anims.create({
    key: BARBACOA_HUMEANTE_ANIM_KEY,
    frames: BARBACOA_HUMEANTE_TEXTURE_KEYS.map((key) => ({ key })),
    frameRate: 8,
    repeat: -1,
  });
}

export const BARBACOA_LADRILLO_ENCENDIDA_TEXTURE_KEYS = [0, 1, 2, 3, 4, 5, 6].map(
  (i) => `barbacoa-ladrillo-encendida-${i}`,
);
export const BARBACOA_LADRILLO_ANIM_KEY = 'barbacoa-ladrillo-flicker';

/** Registers the looping flame-flicker animation, called once from PreloadScene.create(). */
export function registerBarbacoaLadrilloAnimations(scene: Phaser.Scene): void {
  scene.anims.create({
    key: BARBACOA_LADRILLO_ANIM_KEY,
    frames: BARBACOA_LADRILLO_ENCENDIDA_TEXTURE_KEYS.map((key) => ({ key })),
    frameRate: 8,
    repeat: -1,
  });
}

export const AGUA_RIO_TEXTURE_KEYS = [0, 1, 2, 3, 4, 5, 6].map((i) => `agua-rio-${i}`);
export const AGUA_RIO_ANIM_KEY = 'agua-rio-undulate';

/** Registers the looping water-surface animation, called once from PreloadScene.create(). */
export function registerAguaRioAnimations(scene: Phaser.Scene): void {
  scene.anims.create({
    key: AGUA_RIO_ANIM_KEY,
    frames: AGUA_RIO_TEXTURE_KEYS.map((key) => ({ key })),
    frameRate: 8,
    repeat: -1,
  });
}

export const PAJARO_BLANCO_TEXTURE_KEYS = {
  flyEast: [0, 1, 2, 3, 4, 5, 6].map((i) => `pajaro-blanco-fly-east-${i}`),
  flyWest: [0, 1, 2, 3, 4, 5, 6].map((i) => `pajaro-blanco-fly-west-${i}`),
};

export const PAJARO_BLANCO_ANIM_KEYS = {
  flyEast: 'pajaro-blanco-fly-east',
  flyWest: 'pajaro-blanco-fly-west',
};

/** Registers the looping wing-flap animations (east/west), called once from PreloadScene.create(). */
export function registerPajaroBlancoAnimations(scene: Phaser.Scene): void {
  scene.anims.create({
    key: PAJARO_BLANCO_ANIM_KEYS.flyEast,
    frames: PAJARO_BLANCO_TEXTURE_KEYS.flyEast.map((key) => ({ key })),
    frameRate: 12,
    repeat: -1,
  });
  scene.anims.create({
    key: PAJARO_BLANCO_ANIM_KEYS.flyWest,
    frames: PAJARO_BLANCO_TEXTURE_KEYS.flyWest.map((key) => ({ key })),
    frameRate: 12,
    repeat: -1,
  });
}

export const RESPAWN_STATIC_KEY = 'respawn-base';
export const RESPAWN_WAVE_TEXTURE_KEYS = [0, 1, 2, 3, 4, 5, 6].map((i) => `respawn-wave-${i}`);
export const RESPAWN_WAVE_ANIM_KEY = 'respawn-wave';

/** Registers the looping flag-wave animation, played only while a Respawn point is the
 *  currently active one — called once from PreloadScene.create(). */
export function registerRespawnAnimations(scene: Phaser.Scene): void {
  scene.anims.create({
    key: RESPAWN_WAVE_ANIM_KEY,
    frames: RESPAWN_WAVE_TEXTURE_KEYS.map((key) => ({ key })),
    frameRate: 8,
    repeat: -1,
  });
}

export const ESPORA_DIENTE_LEON_TEXTURE_KEYS = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `espora-diente-leon-${i}`);
export const ESPORA_DIENTE_LEON_FLY_TEXTURE_KEYS = [0, 1, 2, 3, 4, 5, 6].map((i) => `espora-diente-leon-fly-${i}`);
export const ESPORA_DIENTE_LEON_GROUND_ANIM_KEY = 'espora-diente-leon-ground';
export const ESPORA_DIENTE_LEON_FLY_ANIM_KEY = 'espora-diente-leon-fly';

/** Registers a slow idle loop (grounded, 8 "float" frames) and a separate loop for flying
 *  (7 "sway" frames) — two distinct source animations, not the same frames at different speeds.
 *  Called once from PreloadScene.create(). */
export function registerEsporaDienteLeonAnimations(scene: Phaser.Scene): void {
  scene.anims.create({
    key: ESPORA_DIENTE_LEON_GROUND_ANIM_KEY,
    frames: ESPORA_DIENTE_LEON_TEXTURE_KEYS.map((key) => ({ key })),
    frameRate: 4,
    repeat: -1,
  });
  scene.anims.create({
    key: ESPORA_DIENTE_LEON_FLY_ANIM_KEY,
    frames: ESPORA_DIENTE_LEON_FLY_TEXTURE_KEYS.map((key) => ({ key })),
    frameRate: 10,
    repeat: -1,
  });
}

export const CORAZON_CRISTAL_NARANJA_TEXTURE_KEYS = [0, 1, 2, 3, 4, 5, 6].map(
  (i) => `corazon-cristal-naranja-${i}`,
);
export const CORAZON_CRISTAL_NARANJA_ANIM_KEY = 'corazon-cristal-naranja-pulse';

/** Registers the looping "gentle pulse" glow animation for the extra-life crystal heart,
 *  called once from PreloadScene.create(). */
export function registerCorazonCristalNaranjaAnimations(scene: Phaser.Scene): void {
  scene.anims.create({
    key: CORAZON_CRISTAL_NARANJA_ANIM_KEY,
    frames: CORAZON_CRISTAL_NARANJA_TEXTURE_KEYS.map((key) => ({ key })),
    frameRate: 8,
    repeat: -1,
  });
}

export const AVISPA_TEXTURE_KEYS = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `avispa-fly-${i}`);
export const AVISPA_ANIM_KEY = 'avispa-fly';

/** Registers the looping wing-flap animation. Source art is west-facing only — GEAvispa
 *  mirrors it with setFlipX when the wasp is heading east. Called once from PreloadScene.create(). */
export function registerAvispaAnimations(scene: Phaser.Scene): void {
  scene.anims.create({
    key: AVISPA_ANIM_KEY,
    frames: AVISPA_TEXTURE_KEYS.map((key) => ({ key })),
    frameRate: 20,
    repeat: -1,
  });
}
