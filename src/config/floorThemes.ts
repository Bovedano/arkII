/** Floor tile themes available in public/assets/blocks/floor/<theme>/. Vite can't glob the
 *  public/ dir at build time, so add the theme name here whenever a new tile-color folder is
 *  dropped in — PreloadScene and GEFloor's theme selector both read from this list. */
export const FLOOR_THEMES = ['blue', 'brown', 'green', 'yellow'] as const;

export type FloorTheme = (typeof FLOOR_THEMES)[number];
