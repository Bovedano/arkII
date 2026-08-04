---
description: Crea un nuevo nivel vacío (jugable desde el menú) a partir de un nombre/título
argument-hint: [nombre-del-nivel]
---

Vas a crear un nuevo nivel en este proyecto (Phaser + TypeScript). Los niveles se auto-descubren
desde `src/levels/data/*.ts` — ver `src/levels/levelRegistry.ts`: cada archivo exporta **una única
constante string** con el nivel en JSON (`LevelDefinition`, ver `src/levels/types.ts`). No hace
falta registrar nada a mano.

## 1. Obtener el título

- Título recibido como argumento: `$ARGUMENTS`
- Si viene vacío, pregunta al usuario qué título quiere para el nivel y espera su respuesta antes
  de continuar.

## 2. Elegir id de archivo

Lista `src/levels/data/` y busca el número más alto usado en nombres `level-NN*.ts` (p.ej. si
existen `level-01.ts`, `level-01b.ts`, `level-02.ts`, el siguiente es `03`). Usa:

- Fichero: `src/levels/data/level-<NN>.ts` (NN con dos dígitos, p.ej. `03`)
- Constante exportada: `LEVEL_<NN>_TEXT`
- `id` dentro del JSON: `level-<NN>`

No reutilices un `id` ya existente en otro nivel.

## 3. Crear el fichero del nivel

Sigue exactamente el patrón de `src/levels/data/level-01.ts`: la constante es un string JSON
(no un objeto JS), para que `LevelLoader.parse()` siempre haga un `JSON.parse()` real. Nivel
mínimo pero jugable: suelo sólido + `Penista` (el personaje, obligatorio para poder jugar el
nivel) apoyado sobre él.

```ts
export const LEVEL_<NN>_TEXT = `{
  "id": "level-<NN>",
  "title": "<Título indicado por el usuario>",
  "config": { "width": 1600, "height": 540, "gravity": 600, "background": "#4a7fc9" },
  "elements": [
    { "type": "ColorBlock", "x": 0, "y": 500, "params": { "width": 1600, "height": 40, "color": "#4a3728", "zIndex": 0, "behavior": "solid" } },
    { "type": "Penista", "x": 100, "y": 400, "params": { "zIndex": 10, "behavior": "solid" } }
  ]
}`;
```

Ajusta `width`/`height`/`background` solo si el usuario da alguna pista sobre el tamaño o
ambientación del nivel; si no, usa esos valores por defecto (calcados de `level-01`).

## 4. Verificar

Ejecuta `npm run typecheck` para confirmar que compila. Si falla, corrígelo antes de terminar.

## 5. Resumen final

Termina con un resumen breve: fichero creado, `id` y `title` del nivel, y recuerda que ya
aparecerá automáticamente en la pantalla de selección de niveles (`LevelSelectScene`) — y que se
puede seguir editando visualmente con el editor de niveles del proyecto.
