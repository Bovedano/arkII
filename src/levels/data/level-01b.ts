// Hidden sublevel of level-01 ("cueva_secreta") — locked until switch1 is triggered there.
export const LEVEL_01B_TEXT = `{
  "id": "level-01b",
  "title": "Cueva Secreta",
  "dev": true,
  "config": { "width": 800, "height": 540, "gravity": 600, "background": "#1d1d2b" },
  "elements": [
    { "type": "ColorBlock", "x": 0, "y": 500, "params": { "width": 800, "height": 40, "color": "#2f2f3a", "zIndex": 0, "behavior": "solid" } },
    { "type": "Penista", "x": 80, "y": 400, "params": { "zIndex": 10, "behavior": "solid" } }
  ]
}`;
