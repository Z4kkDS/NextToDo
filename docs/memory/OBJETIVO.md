# 🎯 Objetivo

## Visión
**La app donde tu dinero y tus pendientes viven juntos.**

NexToDo une gestión de tareas con finanzas personales en una sola herramienta.
Ese cruce es el diferenciador y el foso defensivo: las apps de tareas no manejan
dinero, las de finanzas no manejan pendientes.

## Para quién
Usuario individual (Chile / CLP) que quiere organizar su día y controlar su
presupuesto mensual sin saltar entre apps. Pensado para entrada rápida, sin
fricción de registro (modo local disponible).

## El diferenciador (no perder esto de vista)
Las features que más valor único agregan son las que **conectan tareas y
finanzas** (ver F-01, F-02, F-03 en `../SPECS.md`). Una tarea "Pagar arriendo
$300.000" debería ser, a la vez, un pendiente y un gasto programado. Esa
integración es lo que ninguna otra app hace bien.

## Principios de producto
- 🇪🇸 UI en español · marca **NexToDo** · moneda **CLP** (formato `$300.000`).
- 🔓 Sin fricción: cuenta Google **o** modo local (localStorage).
- 🧱 Entrega por **etapas**, revisando cada bloque antes de seguir.
- 📦 No añadir dependencias nuevas salvo que sea imprescindible.
- ♿ Accesible: contraste, focus visible, `prefers-reduced-motion`, sin emojis
  como iconos (usar Lucide SVG).
- ✅ `next build` en verde antes de cerrar cualquier feature.

## Principios técnicos
- **Persistencia dual** en todo: servicio Firestore + servicio localStorage,
  seleccionado por `user.isLocal`. Cualquier modelo nuevo debe implementar ambos.
- Modelos retrocompatibles: campos nuevos opcionales, sin romper datos previos.
- Diseño guiado por la skill `ui-ux-pro-max`. Paleta indigo (#6366F1 light /
  #818CF8 dark), estilo Todoist/Linear.
