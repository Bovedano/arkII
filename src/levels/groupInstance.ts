import type { GroupInstanceDef, LevelDefinition, LevelElementDef } from './types';

export interface ResolvedGroupChild {
  id: string;
  def: LevelElementDef;
}

/**
 * Single source of truth for expanding a placed GroupInstanceDef into real, level-absolute
 * elements — used by both LevelLoader (real gameplay) and EditorCanvas (editor preview) so
 * they can never disagree about the resulting ids. Composite id ("<instanceId>:<childId>")
 * keeps two placements of the same group from colliding even though their children share the
 * same literal child id.
 */
export function resolveGroupInstance(
  level: LevelDefinition,
  instance: GroupInstanceDef,
): ResolvedGroupChild[] | null {
  const group = level.groups?.find((g) => g.id === instance.groupId);
  if (!group) return null;
  return group.elements.map((child, i) => ({
    id: `${instance.id}:${child.id ?? `${child.type}-${i}`}`,
    def: { ...child, x: instance.x + child.x, y: instance.y + child.y },
  }));
}
