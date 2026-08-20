import Phaser from 'phaser';
import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { PhysicsBody } from '../core/mixins/PhysicsBody';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams, GameElementParamFieldSchema } from '../core/types';
import {
  ESPORA_DIENTE_LEON_TEXTURE_KEYS,
  ESPORA_DIENTE_LEON_GROUND_ANIM_KEY,
  ESPORA_DIENTE_LEON_FLY_ANIM_KEY,
} from '../../systems/animations';

export interface EsporaDienteLeonParams extends GameElementParams {
  groundDelaySec?: number;
  swayAmplitudeDeg?: number;
  flight1Speed?: number;
  flight1DurationSec?: number;
  flight1DirectionDeg?: number;
  flight2Speed?: number;
  flight2DurationSec?: number;
  flight2DirectionDeg?: number;
  flight3Speed?: number;
  flight3DurationSec?: number;
  flight3DirectionDeg?: number;
  flight4Speed?: number;
  flight4DurationSec?: number;
  flight4DirectionDeg?: number;
  flight5Speed?: number;
  flight5DurationSec?: number;
  flight5DirectionDeg?: number;
}

interface Flight {
  speed: number;
  durationSec: number;
  directionDeg: number;
}

type Phase = 'grounded' | 'flying';

/**
 * Trimmed collision box within the 168x168 frame — measured against the drawn silhouette (a
 * narrow stem topped by a wide, sparse seed head) rather than the whole transparent canvas.
 * Fixed explicitly via setBodyBox() so it never depends on whichever frame/texture the
 * ground/fly animations happen to be showing — Arcade bodies don't auto-resize per animation
 * frame here (all frames share the same 168x168 canvas and origin), but the sway rotation
 * applied to the sprite each flight frame doesn't rotate the (always axis-aligned) physics body
 * with it, so pinning an explicit, generous box keeps whatever rides on top from jittering
 * against a mismatched edge as the visual tilts back and forth.
 */
const BODY_BOX = { width: 50, height: 50, offsetX: 60, offsetY: 30 };

const SWAY_FREQUENCY_HZ = 0.6;
const BLINK_DURATION_MS = 1000;
const BLINK_FLICKER_MS = 80;

/**
 * A dandelion spore that sits on the ground, then launches through up to 5 chained flights
 * (each with its own speed/duration/direction), swaying as it flies. During the final second of
 * the last flight it flickers in place (still moving) as a "about to vanish" warning, then at
 * the end of that flight teleports back to its spawn position and resets to 'grounded' so the
 * whole cycle repeats (never destroyed). Carrying the player while riding it is handled
 * generically by GameScene (see the `carry` param, defaulted to true below, and
 * GameScene.tickCarriers()) — this class only owns its own flight state machine. The body is
 * immovable (setImmovable) so the player can't shove it around when colliding with it from the
 * side.
 */
export class GEEsporaDienteLeon extends PhysicsBody(Renderable(GameElement<EsporaDienteLeonParams>)) {
  readonly type = 'EsporaDienteLeon';

  private phase: Phase = 'grounded';
  private phaseElapsedMs = 0;
  private flightIndex = 0;
  private flights: Flight[] = [];
  private baseAngle = 0;

  init(): void {
    const sprite = this.scene.add.sprite(this.x, this.y, ESPORA_DIENTE_LEON_TEXTURE_KEYS[0]);
    this.setVisual(sprite);
    this.enablePhysics();
    this.setBodyBox(BODY_BOX.width, BODY_BOX.height, BODY_BOX.offsetX, BODY_BOX.offsetY);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    // Otherwise the player colliding with it (from the side, or landing on top) shoves it
    // around like any other dynamic body — it should only move via the velocity we set here.
    body.setImmovable(true);

    this.baseAngle = sprite.angle;
    sprite.play(ESPORA_DIENTE_LEON_GROUND_ANIM_KEY);

    this.flights = this.readFlights();
  }

  update(_time: number, delta: number): void {
    this.phaseElapsedMs += delta;
    if (this.phase === 'grounded') {
      this.tickGrounded();
    } else {
      this.tickFlight();
    }
  }

  private readFlights(): Flight[] {
    const p = this.params;
    const raw = [
      { speed: p.flight1Speed, durationSec: p.flight1DurationSec, directionDeg: p.flight1DirectionDeg },
      { speed: p.flight2Speed, durationSec: p.flight2DurationSec, directionDeg: p.flight2DirectionDeg },
      { speed: p.flight3Speed, durationSec: p.flight3DurationSec, directionDeg: p.flight3DirectionDeg },
      { speed: p.flight4Speed, durationSec: p.flight4DurationSec, directionDeg: p.flight4DirectionDeg },
      { speed: p.flight5Speed, durationSec: p.flight5DurationSec, directionDeg: p.flight5DirectionDeg },
    ];
    return raw
      .filter((f) => (f.durationSec ?? 0) > 0)
      .map((f) => ({ speed: f.speed ?? 0, durationSec: f.durationSec ?? 0, directionDeg: f.directionDeg ?? 0 }));
  }

  private tickGrounded(): void {
    if (this.flights.length === 0) return; // nothing configured to fly — stays grounded forever
    const delaySec = this.params.groundDelaySec ?? 2;
    if (this.phaseElapsedMs >= delaySec * 1000) this.startFlight(0);
  }

  private startFlight(index: number): void {
    this.flightIndex = index;
    this.phase = 'flying';
    this.phaseElapsedMs = 0;

    const flight = this.flights[index];
    const rad = Phaser.Math.DegToRad(flight.directionDeg);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(Math.cos(rad) * flight.speed, Math.sin(rad) * flight.speed);
    (this.visual as Phaser.GameObjects.Sprite).play(ESPORA_DIENTE_LEON_FLY_ANIM_KEY, true);
  }

  private tickFlight(): void {
    const sprite = this.visual as Phaser.GameObjects.Sprite;
    const amplitude = this.params.swayAmplitudeDeg ?? 0;
    if (amplitude > 0) {
      const sway = Math.sin((this.phaseElapsedMs / 1000) * SWAY_FREQUENCY_HZ * Math.PI * 2) * amplitude;
      sprite.setAngle(this.baseAngle + sway);
    }

    const flight = this.flights[this.flightIndex];
    const durationMs = flight.durationSec * 1000;
    const isLastFlight = this.flightIndex === this.flights.length - 1;

    // Flicker through the final second of the last flight — still moving/swaying — as a warning
    // before it vanishes, instead of stopping to blink afterwards.
    if (isLastFlight && durationMs - this.phaseElapsedMs <= BLINK_DURATION_MS) {
      const flickerOn = Math.floor(this.phaseElapsedMs / BLINK_FLICKER_MS) % 2 === 0;
      sprite.setAlpha(flickerOn ? 1 : 0.15);
    }

    if (this.phaseElapsedMs < durationMs) return;

    if (isLastFlight) {
      this.respawnAtOrigin();
    } else {
      this.startFlight(this.flightIndex + 1);
    }
  }

  /** Teleports back to the spawn position and resets to 'grounded' so the whole cycle repeats,
   *  instead of destroying the element. Anyone riding it is left behind — the platform simply
   *  isn't under them anymore next physics step, so they fall like off any other ledge. Doesn't
   *  need to touch anything carry-related: GameScene.tickCarriers() reads body.deltaX()/deltaY()
   *  (Phaser's own per-physics-step delta), which this teleport — a same-frame manual position
   *  set — never affects, so it can't be misread as a huge one-frame carry movement.
   *
   *  Uses body.reset() rather than setPosition()+updateFromGameObject(): the latter only syncs
   *  the body's current position, not Arcade's internal prev/prevFrame tracking, so
   *  Body.postUpdate() (gameObject.y += pos.y - prevFrame.y) re-applies the last flight frame's
   *  overshoot on top of the freshly-reset spot — the dandelion would land a few px off origin,
   *  worse the longer/faster the final leg. reset() clears prev/prevFrame/velocity together. */
  private respawnAtOrigin(): void {
    const sprite = this.visual as Phaser.GameObjects.Sprite;
    const body = this.body as Phaser.Physics.Arcade.Body;

    body.reset(this.x, this.y);
    sprite.setAlpha(1);
    sprite.setAngle(this.baseAngle);
    sprite.play(ESPORA_DIENTE_LEON_GROUND_ANIM_KEY);

    this.phase = 'grounded';
    this.phaseElapsedMs = 0;
    this.flightIndex = 0;
  }
}

function flightSchema(n: 1 | 2 | 3 | 4 | 5, defaults: Flight): GameElementParamFieldSchema[] {
  return [
    { key: `flight${n}Speed`, label: `Vuelo ${n} - Velocidad`, kind: 'number', default: defaults.speed },
    {
      key: `flight${n}DurationSec`,
      label: `Vuelo ${n} - Duración (s)`,
      kind: 'number',
      default: defaults.durationSec,
    },
    {
      key: `flight${n}DirectionDeg`,
      label: `Vuelo ${n} - Dirección (°)`,
      kind: 'number',
      default: defaults.directionDeg,
    },
  ];
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('EsporaDienteLeon', (args) => new GEEsporaDienteLeon(args as any), {
  defaultParams: {
    zIndex: 5,
    behavior: 'solid',
    carry: true,
    groundDelaySec: 2,
    swayAmplitudeDeg: 12,
    flight1Speed: 150,
    flight1DurationSec: 2,
    flight1DirectionDeg: 270,
    flight2Speed: 0,
    flight2DurationSec: 0,
    flight2DirectionDeg: 0,
    flight3Speed: 0,
    flight3DurationSec: 0,
    flight3DirectionDeg: 0,
    flight4Speed: 0,
    flight4DurationSec: 0,
    flight4DirectionDeg: 0,
    flight5Speed: 0,
    flight5DurationSec: 0,
    flight5DirectionDeg: 0,
  },
  paramSchema: [
    { key: 'groundDelaySec', label: 'Espera en el suelo (s)', kind: 'number', default: 2 },
    { key: 'swayAmplitudeDeg', label: 'Balanceo (grados)', kind: 'number', default: 12 },
    ...flightSchema(1, { speed: 150, durationSec: 2, directionDeg: 270 }),
    ...flightSchema(2, { speed: 0, durationSec: 0, directionDeg: 0 }),
    ...flightSchema(3, { speed: 0, durationSec: 0, directionDeg: 0 }),
    ...flightSchema(4, { speed: 0, durationSec: 0, directionDeg: 0 }),
    ...flightSchema(5, { speed: 0, durationSec: 0, directionDeg: 0 }),
  ],
});
