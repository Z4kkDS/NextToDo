# 🎨 Design Brief — Rediseño visual de NexToDo

> Estado: **en definición** (2026-06-06). Dirección acordada con el usuario.
> Objetivo: darle a NexToDo un estilo **retro-playful gamificado**, único y
> entretenido, manteniéndolo **ordenado, intuitivo y fácil de leer con poco scroll**.

---

## 1. Decisiones acordadas

| Eje | Decisión |
|-----|----------|
| **Gamificación** | Sutil y motivacional: XP/puntos al completar, niveles ligeros, rachas mejoradas, micro-celebraciones. Nunca distrae del trabajo. |
| **Estilo visual** | **Retro + playful** (Pixel Art moderno). **CERO emojis** — iconos pixel-art en SVG. |
| **Iconos** | Librería pixel-art SVG. Candidata: **Pixelarticons** (~480 iconos, MIT). ⚠️ Confirmar con el usuario si tenía otra en mente. |
| **Paleta** | Base **naranja + grises cálidos**, con un dorado/ámbar para recompensas. Abierto a afinar. |
| **Layout** | **Bento grid compacto**: módulos en cuadrícula de distinto tamaño, todo de un vistazo, mínimo scroll. |
| **Legibilidad** | Prioridad alta. Fuente pixel SOLO en títulos/acentos/números; cuerpo en sans limpia. |

---

## 2. Paleta propuesta (a validar)

Naranja vibrante + grises cálidos (stone) + dorado para recompensas. Un cian
retro opcional como pop frío en gráficos/links.

### Light
| Rol | Hex | Nota |
|-----|-----|------|
| Background | `#FAF7F2` | papel cálido |
| Foreground | `#1C1917` | stone-900 |
| Card | `#FFFFFF` | |
| Primary | `#F97316` | naranja-500 |
| On Primary | `#1C1917` | texto oscuro sobre naranja (look retro, buen contraste) |
| Reward / XP | `#F59E0B` | ámbar-dorado |
| Secondary surface | `#F5F5F4` | stone-100 |
| Muted text | `#78716C` | stone-500 |
| Border | `#E7E5E4` | stone-200 |
| Pop frío (opcional) | `#06B6D4` | cian retro para datos/links |
| Destructive | `#DC2626` | |

### Dark
| Rol | Hex | Nota |
|-----|-----|------|
| Background | `#1A1715` | negro cálido |
| Foreground | `#FAFAF9` | |
| Card | `#292524` | stone-800 |
| Primary | `#FB923C` | naranja-400 (más claro para contraste) |
| On Primary | `#1C1917` | |
| Reward / XP | `#FBBF24` | |
| Muted text | `#A8A29E` | stone-400 |
| Border | `#ffffff14` | hairline cálido |

---

## 3. Tipografía

- **Títulos / acentos / números (XP, nivel, montos):** fuente pixel.
  - Opción A: **Pixelify Sans** (pixel pero legible a tamaños medianos). *Recomendada.*
  - Opción B: **Press Start 2P** (más 8-bit, reservar para textos muy cortos: XP, nivel).
- **Cuerpo / UI:** sans limpia y legible. Mantener **Geist Sans** (ya cargada) o **Inter**.
- Regla: la fuente pixel nunca en párrafos ni listas largas.

---

## 4. Gamificación — elementos concretos

- **XP por acción**: completar tarea (+10), subtarea (+2), cumplir meta de ahorro, etc.
- **Niveles**: barra de XP con nivel actual; subir de nivel dispara micro-celebración.
- **Racha** (ya existe): rediseñar con fuego pixel + multiplicador.
- **Micro-celebraciones**: animación pixel breve al completar (respeta `prefers-reduced-motion`).
- **Logros/insignias ligeras** (opcional v2): "primera tarea", "7 días seguidos", "presupuesto cumplido".
- Persistencia por usuario (Firestore/localStorage), igual que el resto.

> Nota: el sistema de XP/niveles sería una **feature nueva** además del reskin.
> Se puede separar en dos entregas: (a) reskin visual + bento, (b) capa de gamificación.

---

## 5. Layout bento — qué reorganizar

- **Dashboard / Tareas**: cabecera con saludo + nivel/XP + racha en una fila compacta;
  bento con: lista de tareas (módulo grande), stats, checklist de bienvenida, accesos.
- **Finanzas**: bento con saldo (grande), dona, tendencia, consejos, proyección, metas —
  todo en cuadrícula en vez de columnas largas.
- Menos scroll: tarjetas de distinto tamaño priorizando lo importante arriba.

---

## 6. Restricciones (no negociables)

- **0 emojis** como iconos → pixel-art SVG.
- Contraste AA (≥4.5:1 en texto); validar fuente pixel a tamaño usable.
- `prefers-reduced-motion` respetado en todas las animaciones.
- Mantener modo claro y oscuro completos.
- No romper la arquitectura: persistencia dual, contextos, auth.
- `next build` en verde.

---

## 7. Prompt para Claude Design

> Pega esto en Claude Design (o herramienta de mockups) para generar propuestas.

```
Diseña la interfaz de "NexToDo", una app web de gestión de tareas + finanzas
personales, con un estilo RETRO-PLAYFUL gamificado (pixel art moderno) que sea
divertido pero ordenado y muy legible.

ESTILO: pixel art moderno + playful. Esquinas redondeadas suaves, sombras
definidas pero no brutalistas, detalles 8-bit sutiles. CERO emojis: usar iconos
pixel-art SVG (estilo Pixelarticons). La fuente pixel (tipo Pixelify Sans) solo
en títulos, números y acentos; el cuerpo en una sans limpia y legible.

PALETA: naranja vibrante (#F97316) como color principal, grises cálidos (stone)
para superficies, y un ámbar dorado (#F59E0B) para recompensas/XP. Modo claro
(fondo papel cálido #FAF7F2) y modo oscuro (negro cálido #1A1715), ambos
completos. Contraste accesible.

LAYOUT: bento grid compacto — módulos en cuadrícula de distinto tamaño para ver
todo de un vistazo con mínimo scroll. Dos secciones por pestañas: "Tareas" y
"Finanzas".

GAMIFICACIÓN SUTIL: barra de XP con nivel del usuario y racha (con icono de fuego
pixel) en la cabecera; micro-celebración pixel al completar una tarea; insignias
ligeras de logros.

PANTALLAS A DISEÑAR:
1. Login (split: panel retro con arte pixel + formulario; botones "Empezar sin
   cuenta" y "Continuar con Google").
2. Dashboard / Tareas: cabecera con saludo + nivel/XP + racha; bento con lista de
   tareas (tarjetas con prioridad por color, etiquetas, monto, subtareas con barra
   de progreso), panel de stats y checklist de bienvenida.
3. Finanzas: bento con saldo disponible (destacado), dona de gastos por categoría,
   barras de tendencia mensual, consejos inteligentes con semáforo, proyección de
   fin de mes y metas de ahorro.
4. Command palette (⌘K) con estética retro.

Entrega mockups para escritorio y móvil, en modo claro y oscuro.
```

---

## 8. Plan de implementación (cuando se apruebe el diseño)

1. **Tokens + tipografía**: nueva paleta naranja/gris en `globals.css` (light+dark),
   cargar fuente pixel, instalar librería de iconos pixel.
2. **Reskin de componentes** existentes a la nueva paleta/estilo (sin cambiar lógica).
3. **Layout bento** en dashboard de Tareas y en Finanzas.
4. **Capa de gamificación** (XP/niveles/celebraciones) — entrega separada.
5. Verificar contraste, reduced-motion, responsive y `next build`.
