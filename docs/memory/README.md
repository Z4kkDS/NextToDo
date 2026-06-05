# 🧠 Memoria del proyecto NexToDo

Carpeta de **contexto vivo** para hacer crecer el proyecto sin perder el hilo
entre sesiones. Tres archivos, cada uno con un propósito:

| Archivo | Para qué sirve | Cuándo se actualiza |
|---------|----------------|---------------------|
| [`OBJETIVO.md`](./OBJETIVO.md) | Visión, diferenciador y principios. Rara vez cambia. | Cuando cambia el rumbo del producto |
| [`STATUS.md`](./STATUS.md) | Tablero: completado / en curso / pendiente con prioridades. | Al empezar y terminar cada feature |
| [`JOURNAL.md`](./JOURNAL.md) | Bitácora de problemas encontrados y la solución que los resolvió. | Cada vez que se resuelve un problema no trivial |

## Cómo trabajamos

1. **Antes de empezar** una feature: se busca su ID en `SPECS.md`, se mueve a
   _En curso_ en `STATUS.md`.
2. **Al terminar**: se mueve a _Completado_ con el nº de PR.
3. **Si aparece un problema** que costó resolver: se anota en `JOURNAL.md`
   (síntoma → causa → solución). Así no lo volvemos a sufrir.
4. Las **specs** (qué construir) viven en `../SPECS.md`. La **memoria** (en qué
   punto estamos y qué aprendimos) vive aquí.

> Regla de oro: si algo te costó descubrir, escríbelo en `JOURNAL.md`.
