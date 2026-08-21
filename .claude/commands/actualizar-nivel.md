---
description: Actualiza un nivel existente con el contenido de un fichero JSON exportado desde el editor
argument-hint: [ruta-al-json]
---

Vas a actualizar un nivel ya existente en este proyecto (Phaser + TypeScript) con el contenido de
un fichero `.json` que te va a indicar el usuario — típicamente exportado desde el editor de
niveles con `LevelExport.download()` (ver `src/editor/LevelExport.ts`), que genera un fichero
`<id>.json` con el `LevelDefinition` completo.

Los niveles viven como texto en `src/levels/data/*.ts`: cada fichero exporta **una única
constante string** con el nivel en JSON (ver `src/levels/levelRegistry.ts` y
`src/levels/types.ts`).

## 1. Obtener la ruta del JSON

- Ruta recibida como argumento: `$ARGUMENTS`
- Si viene vacía, pregunta al usuario la ruta (absoluta o relativa) del fichero JSON y espera su
  respuesta antes de continuar.

## 2. Leer y validar el JSON

- Lee el fichero indicado.
- Comprueba que es JSON válido y que tiene un campo `id` (string). Si el `JSON.parse` fallaría o
  falta `id`, avisa al usuario con el error concreto y para aquí — no adivines contenido.

## 3. Encontrar el fichero de nivel a actualizar

- Busca en `src/levels/data/*.ts` el fichero cuya constante contiene `"id": "<id-del-json>"`
  (mismo `id` leído en el paso 2).
- Si no se encuentra ningún fichero con ese `id`: es un nivel nuevo, no una actualización. Avisa
  al usuario y pregúntale si quiere que lo cree como nivel nuevo (en cuyo caso sigue el patrón de
  `src/levels/data/level-01.ts`: nombre de fichero `level-<NN>.ts`, constante
  `LEVEL_<NN>_TEXT`) o si se equivocó de fichero/id.
- Si se encuentra más de un fichero con ese `id` (no debería pasar), avisa al usuario del
  conflicto y para aquí.

## 4. Actualizar el fichero

- Reemplaza **solo el contenido JSON** dentro del template string de la constante existente
  (`LEVEL_<NN>_TEXT` u otro nombre que ya tenga), manteniendo:
  - El mismo nombre de constante y el mismo `export const ... = \`...\`;`.
  - Cualquier comentario que ya tenga el fichero justo antes del `export` (p.ej. el comentario
    sobre por qué es un string y no un objeto JS, como en `level-01.ts`).
- Usa `JSON.stringify(parsed, null, 2)` como formato del contenido (2 espacios de indentación,
  igual que exporta `LevelExport.toJSON`), para que el diff sea legible.
- Si el JSON contiene backticks (`` ` ``) o `${` en algún string (poco probable, pero posible en
  textos de diálogo), escápalos dentro del template literal.
- No cambies el `id` del nivel salvo que el usuario lo pida explícitamente — si el `id` del JSON
  difiere del que tenía el fichero, avisa antes de sobrescribir.

## 5. Verificar

Ejecuta `npm run typecheck` para confirmar que compila. Si falla, corrígelo antes de terminar.

## 6. Resumen final

Termina con un resumen breve: fichero de nivel actualizado, `id`/`title` del nivel, y un apunte
de qué cambió si es evidente por el diff (p.ej. número de elementos añadidos/eliminados).
