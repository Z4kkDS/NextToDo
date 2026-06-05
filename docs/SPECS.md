# NexToDo — Especificaciones

> Catálogo vivo de features. Cada una tiene un **ID** estable (`F-XX`) que se
> referencia desde `memory/STATUS.md` y `memory/JOURNAL.md`.
> Última actualización: 2026-06-05.

---

## 🎯 Objetivo del proyecto

NexToDo es una app personal que **une la gestión de tareas con las finanzas
personales en un solo lugar**. Ese cruce es su diferenciador: las apps de tareas
(Todoist, things) no manejan dinero, y las de finanzas (YNAB) no manejan
pendientes. NexToDo quiere ser **la app donde tu dinero y tus pendientes viven
juntos**.

Principios:
- UI en **español**, marca **NexToDo**, moneda **CLP**.
- Funciona con cuenta Google (Firestore) o **modo local** (localStorage), sin
  fricción de registro.
- Entrega **por etapas**, revisando cada bloque antes de seguir.
- No añadir dependencias nuevas salvo que sea imprescindible.
- `next build` debe pasar en verde.

---

## 📐 Catálogo de features

Estado: ✅ hecho · 🔄 en curso · 📋 pendiente · 💡 idea
Prioridad: se asigna en sesión de revisión (ver `memory/STATUS.md`).

### Núcleo ya entregado (etapas 1–5)

| ID | Feature | Estado |
|----|---------|--------|
| F-B1 | Onboarding interactivo (tour + checklist) | ✅ |
| F-B2 | Login premium + estado vacío accionable | ✅ |
| F-B3 | Refinamiento visual + tema indigo light/dark | ✅ |
| F-B4 | Buscador, orden, etiquetas, racha, botón completar | ✅ |
| F-B5 | Panel de Finanzas (presupuesto mensual, ingresos, gastos, 50/30/20, metas) | ✅ |
| F-B6 | Auth Google con popup + errores visibles | ✅ |

### 🏆 Diferenciadores — puente Tareas ↔ Finanzas

| ID | Feature | Descripción | Prioridad |
|----|---------|-------------|-----------|
| F-01 | **Tareas con costo** | Una tarea puede llevar un monto y fecha; aparece a la vez como pendiente y como gasto programado en Finanzas. Al completarla se registra el gasto. | 🔴 **P1** |
| F-02 | **Gastos recurrentes → recordatorios** | Subscripciones/cuentas fijas generan tareas con fecha cada mes automáticamente. | 🟡 P2 |
| F-03 | **Metas híbridas** | Meta de ahorro que también es proyecto con sub-pasos. | 🟢 P3 |

### 🤖 Inteligencia

| ID | Feature | Descripción | Prioridad |
|----|---------|-------------|-----------|
| F-04 | **Asistente con Claude API** | Categoriza gastos, da consejos en lenguaje natural, crea tareas desde texto libre. Requiere API key. | 🟢 P3 |
| F-05 | **Consejos inteligentes (reglas)** | Semáforo de salud 🟢🟡🔴, ritmo de gasto, tasa de ahorro. Sin coste de IA. | 🔴 **P1** |
| F-06 | **Resumen "Wrapped"** | Resumen mensual/anual: racha, tareas completadas, gastos por categoría. Compartible. | 🟢 P3 |

### ⚡ Productividad

| ID | Feature | Descripción | Prioridad |
|----|---------|-------------|-----------|
| F-07 | **Tareas recurrentes** | Diaria/semanal/mensual. La feature más pedida en todo apps. | 🔴 **P1** |
| F-08 | **Subtareas / checklist** | Sub-pasos dentro de cada tarea con su barra de progreso. | 🟡 P2 |
| F-09 | **Vista Hoy / próximos 7 días** | Agenda por fecha de vencimiento. | 🟢 P3 |
| F-10 | **Command palette ⌘K** | Crear/buscar/cambiar tab al instante (estilo Linear). | 🟡 P2 |

### 🛠️ Plataforma y datos

| ID | Feature | Descripción | Prioridad |
|----|---------|-------------|-----------|
| F-11 | **PWA instalable + offline** | App instalable; encaja con el modo local existente. | 🟡 P2 |
| F-12 | **Notificaciones push** | Recordatorios de fecha límite y gastos programados. | 🟢 P3 |
| F-13 | **Gráficos en Finanzas** | Dona por categoría + barras de tendencia mensual (requiere recharts). | 🔴 **P1** |
| F-14 | **Proyección + comparación mensual** | "A este ritmo terminarás con X"; mes vs mes anterior. | 🟡 P2 |
| F-15 | **Exportar / importar JSON-CSV** | Respaldo y portabilidad de tareas y finanzas. | 🟢 P3 |

> **Sesión de priorización 2026-06-05:** P1 = F-01, F-05, F-13, F-07.

---

## 📊 Stack técnico (referencia rápida)

Next.js 15.4.6 (App Router) · React 19 · TypeScript · Tailwind v4 · shadcn/ui ·
`motion` · `sonner` · `next-themes` · `lucide-react` · Firebase (Auth + Firestore).

Persistencia dual en todo el proyecto: servicio Firestore + servicio localStorage,
seleccionado por `user.isLocal`. Cualquier modelo nuevo debe respetar este patrón.
