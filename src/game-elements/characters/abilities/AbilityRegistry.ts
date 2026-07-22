import type { Ability } from './Ability';

type AbilityFactory = () => Ability;

class AbilityRegistryImpl {
  private factories = new Map<string, AbilityFactory>();

  register(id: string, factory: AbilityFactory): void {
    if (this.factories.has(id)) {
      throw new Error(`Ability "${id}" is already registered`);
    }
    this.factories.set(id, factory);
  }

  create(id: string): Ability {
    const factory = this.factories.get(id);
    if (!factory) {
      throw new Error(`Unknown ability id "${id}"`);
    }
    return factory();
  }
}

export const AbilityRegistry = new AbilityRegistryImpl();
