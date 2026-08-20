// Stored as a plain string (not a JS object) so LevelLoader.parse() always does a real
// JSON.parse() — exactly what will happen once this text comes from a DB column instead.
export const LEVEL_02_TEXT = `{
  "id": "level-mrvwo79q",
  "title": "Nuevo nivel",
  "dev": true,
  "config": {
    "width": 960,
    "height": 900,
    "gravity": 600,
    "background": "#c94aae",
    "camera": {
      "marginX": 100,
      "marginY": 80
    }
  },
  "sublevels": [],
  "elements": [
    {
      "type": "ColorBlock",
      "x": 0,
      "y": 500,
      "params": {
        "width": 440,
        "height": 40,
        "color": "#4a3728",
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "type": "ColorBlock",
      "x": 560,
      "y": 500,
      "params": {
        "width": 400,
        "height": 40,
        "color": "#4a3728",
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "id": "ColorBlock-pit-floor",
      "type": "ColorBlock",
      "x": 380,
      "y": 850,
      "params": {
        "width": 280,
        "height": 40,
        "color": "#2f2f3a",
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "type": "Penista",
      "x": 429.51325682627623,
      "y": 299.9920854768501,
      "params": {
        "zIndex": 10,
        "behavior": "solid"
      }
    },
    {
      "id": "ColorBlock-mrvwpdge",
      "type": "ColorBlock",
      "x": 484.30589631974686,
      "y": 397.6628413138107,
      "params": {
        "width": 40,
        "height": 100,
        "color": "#4a3728",
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "id": "ColorBlock-mrvwqbun",
      "type": "ColorBlock",
      "x": 624,
      "y": 320,
      "params": {
        "width": 200,
        "height": 40,
        "color": "#4a3728",
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "id": "Switch-mrvwqctr",
      "type": "Switch",
      "x": 727.8860308666403,
      "y": 286.06173328056985,
      "params": {
        "width": 32,
        "height": 32,
        "offColor": "#c94a4a",
        "onColor": "#4ac95a",
        "zIndex": 0,
        "behavior": "sensor"
      }
    }
  ]
}`;
