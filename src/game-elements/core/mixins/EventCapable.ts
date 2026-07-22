import { GameElement } from '../GameElement';
import type { Constructor } from '../types';
import { EventBus } from '../../../systems/EventBus';

type Handler = (...args: any[]) => void;

/**
 * Lets a GameElement emit/listen on the global EventBus, and automatically un-registers
 * its own listeners on destroy() — avoids the classic "listener fires twice after a scene
 * restart" bug, since EventBus outlives any single scene/element instance.
 */
export function EventCapable<TBase extends Constructor<GameElement>>(Base: TBase) {
  abstract class EventCapableElement extends Base {
    private ownListeners: Array<{ event: string; handler: Handler }> = [];

    emit(event: string, ...args: unknown[]): void {
      EventBus.emit(event, ...args);
    }

    on(event: string, handler: Handler): void {
      EventBus.on(event, handler);
      this.ownListeners.push({ event, handler });
    }

    off(event: string, handler: Handler): void {
      EventBus.off(event, handler);
      this.ownListeners = this.ownListeners.filter((l) => !(l.event === event && l.handler === handler));
    }

    destroy(): void {
      for (const { event, handler } of this.ownListeners) EventBus.off(event, handler);
      this.ownListeners = [];
      super.destroy();
    }
  }
  return EventCapableElement;
}
