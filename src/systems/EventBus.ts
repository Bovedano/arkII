import Phaser from 'phaser';

/**
 * Game-wide event emitter, independent of any single scene's `this.events` (which dies
 * with that scene). This is how a GameElement inside GameScene can notify GameState or
 * LevelSelectScene about something (a switch flipped, an ability unlocked) without either
 * side holding a direct reference to the other.
 */
export const EventBus = new Phaser.Events.EventEmitter();
