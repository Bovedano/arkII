---
description: Crea un nuevo GameElement decorativo a partir de una carpeta de sprites, siguiendo el patrón de GECervezaEstrella
argument-hint: [ruta-carpeta-sprites]
---

Vas a crear un nuevo `GameElement` en este proyecto (Phaser + TypeScript) a partir de una carpeta
de sprites que te va a indicar el usuario. Por defecto el elemento es **puramente decorativo**
(sin física, sin eventos) — solo añade complejidad si el usuario la pide explícitamente.

## 1. Obtener la carpeta de sprites

- Ruta recibida como argumento: `$ARGUMENTS`
- Si viene vacío, pregunta al usuario la ruta absoluta o relativa de la carpeta con los sprites y
  espera su respuesta antes de continuar.
- Lista el contenido de la carpeta (imágenes, subcarpetas, `metadata.json`).

## 2. Leer `metadata.json` (si existe)

Si la carpeta tiene un `metadata.json`, léelo y úsalo para inferir lo que puedas: nombre del
elemento, si es un sprite estático o una animación (varios frames/subcarpetas), tamaño, y
cualquier parámetro relevante. Si no existe `metadata.json`, infiere a partir de los nombres de
fichero y pregunta al usuario lo que falte.

## 3. Confirmar con el usuario antes de tocar nada

Antes de copiar ficheros o generar código, confirma (o pregunta si no está claro):

- **Nombre del elemento** en PascalCase (p.ej. `CervezaEstrella`) — se usará como `GE<Nombre>.ts`
  y como `type` registrado.
- **Categoría** dentro de `src/game-elements/` (`collectibles`, `blocks`, `characters`,
  `interactive`, o una nueva si no encaja en ninguna).
- **Sprite estático o animado**: una sola imagen → estático; varias imágenes numeradas o
  subcarpetas → animado (mira el ejemplo de `public/assets/penista/` y
  `src/systems/animations.ts` para el patrón de animaciones).
- Confirma que es **decorativo** (sin colisión, sin eventos) salvo que el usuario diga lo
  contrario explícitamente.

## 4. Copiar los assets

Sigue la convención ya usada en `public/assets/`:

- Sprite estático simple → cópialo directo a `public/assets/<categoría-plural>/<nombre-kebab>.png`
  (mismo patrón que `public/assets/collectibles/cerveza-estrella.png`).
- Sprite animado / multi-frame → crea su propia carpeta `public/assets/<nombre-kebab>/` y respeta
  la estructura de subcarpetas de origen (mismo patrón que `public/assets/penista/`).

No borres ni muevas la carpeta de origen que indicó el usuario; solo copia.

## 5. Generar `GE<Nombre>.ts`

Ubícalo en `src/game-elements/<categoría>/GE<Nombre>.ts`. Para el caso decorativo por defecto,
sigue este patrón mínimo (basado en `GEColorBlock`/`GECervezaEstrella` pero sin física ni eventos):

```ts
import { GameElement } from '../core/GameElement';
import { Renderable } from '../core/mixins/Renderable';
import { GameElementRegistry } from '../core/registry';
import type { GameElementParams } from '../core/types';

export type <Nombre>Params = GameElementParams;

export class GE<Nombre> extends Renderable(GameElement<<Nombre>Params>) {
  readonly type = '<Nombre>';

  init(): void {
    const image = this.scene.add.image(this.x, this.y, '<nombre-kebab>');
    this.setVisual(image);
  }
}

// LevelLoader calls .init() itself after creating the element — the factory only constructs.
GameElementRegistry.register('<Nombre>', (args) => new GE<Nombre>(args as any), {
  defaultParams: { zIndex: 5, behavior: 'background' },
  paramSchema: [],
});
```

Si el usuario pidió colisión o eventos, añade los mixins `PhysicsBody`/`EventCapable` siguiendo el
mismo estilo que `GECervezaEstrella.ts` o `GESwitch.ts`, y ajusta `behavior` (`solid`/`sensor`) y
`paramSchema` en consecuencia — pero no lo hagas por defecto.

## 6. Registrar la carga del asset en `PreloadScene.ts`

Añade la línea de carga correspondiente en `preload()`:

- Estático: `this.load.image('<nombre-kebab>', 'assets/<categoría-plural>/<nombre-kebab>.png');`
- Animado: replica el patrón del bucle usado para `penista` (carga cada frame con su key, y si
  hace falta animación en bucle, regístrala en `src/systems/animations.ts` con
  `scene.anims.create(...)`, nunca dentro de una escena que se pueda recrear).

## 7. Registrar el nuevo tipo en `registerAll.ts`

Añade `import './<categoría>/GE<Nombre>';` a `src/game-elements/registerAll.ts`. No hace falta
tocar nada más del editor: `EditorSidebar`/`LevelConfigPanel` leen la paleta de tipos directamente
de `GameElementRegistry.list()`.

## 8. Verificar

Ejecuta `npm run typecheck` para confirmar que compila. Si falla, corrígelo antes de terminar.

## 9. Resumen final

Termina con un resumen breve: ficheros creados/editados, el `type` registrado, y la key de asset
usada — para que el usuario pueda colocarlo desde el editor de niveles.
