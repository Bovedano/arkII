// Stored as a plain string (not a JS object) so LevelLoader.parse() always does a real
// JSON.parse() — exactly what will happen once this text comes from a DB column instead.
export const LEVEL_01_TEXT = `{
  "id": "level-01",
  "title": "Nivel 1",
  "config": { "width": 1600, "height": 540, "gravity": 600, "background": "#4a7fc9" },
  "sublevels": [
    { "id": "cueva_secreta", "level": "level-01b", "unlockOn": "switch1:on" }
  ],
  "elements": [
    { "type": "ColorBlock", "x": 0, "y": 500, "params": { "width": 1600, "height": 40, "color": "#4a3728", "zIndex": 0, "behavior": "solid" } },
    { "id": "switch1", "type": "Switch", "x": 700, "y": 468, "params": { "width": 32, "height": 32, "zIndex": 1, "behavior": "sensor" } },
    { "type": "Penista", "x": 100, "y": 400, "params": { "zIndex": 10, "behavior": "solid" } }
  ]
}`;
