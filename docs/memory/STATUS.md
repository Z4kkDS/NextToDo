# 📊 Estado del proyecto

> Tablero único de verdad. IDs referencian `../SPECS.md`.
> Última actualización: 2026-06-06 · `main` en commit `8910a39`.

---

## ✅ Completado (en `main`)

| ID | Feature | PR |
|----|---------|-----|
| F-B1 | Onboarding interactivo (tour 6 pasos + WelcomeChecklist) | #6 |
| F-B2 | Login premium (aurora, sin emojis) + estado vacío accionable | #8, #10 |
| F-B3 | Refinamiento visual + tema indigo light/dark | #10 |
| F-B4 | Buscador, ordenamiento, etiquetas, racha, botón completar | #11 |
| F-B5 | Panel de Finanzas (mes independiente, ingresos, gastos, 50/30/20, metas) | #12 → #14 |
| F-B6 | Auth Google: popup + errores visibles por toast | #13 |
| F-01 | Tareas con costo (puente tareas↔finanzas) | #16 |
| F-05 | Consejos inteligentes (motor de reglas + semáforo) | #17 |
| F-13 | Gráficos en Finanzas (dona + tendencia) | #18 |
| F-07 | Tareas recurrentes | #19 |
| F-08 | Subtareas / checklist | #20 |
| F-10 | Command palette ⌘K | #21 |
| F-11 | PWA instalable + offline | #22 |
| F-14 | Proyección fin de mes + comparación mensual | #23 |

---

## 🔄 En curso

**Rediseño visual de la UI** (no es una feature del catálogo): estilo gamificado
único, nueva paleta de colores, reorganización de elementos para que sea
ordenado, intuitivo y con menos scroll. En fase de definición de dirección de
diseño (ver `DESIGN-BRIEF.md` cuando exista). Pausamos features nuevas hasta
acordar el diseño.

---

## 📋 Pendiente (backlog priorizado)

Priorizado en sesión 2026-06-05.

### 🔴 P1 — próxima ola
- [x] **F-01** Tareas con costo (puente tareas↔finanzas) — ✅ hecho (#16)
- [x] **F-05** Consejos inteligentes (motor de reglas + semáforo) — ✅ hecho (#17)
- [x] **F-13** Gráficos en Finanzas (dona + tendencia) — ✅ hecho (#18)
- [x] **F-07** Tareas recurrentes — ✅ hecho

### 🟡 P2 — siguiente
- [~] **F-02** Gastos recurrentes → recordatorios — *cubierto por F-01+F-07*
  (una tarea recurrente con monto ya es un recordatorio de gasto). Descartado
  salvo que se pida el puente inverso (gasto del presupuesto → tarea).
- [x] **F-08** Subtareas / checklist — ✅ hecho (#20)
- [x] **F-10** Command palette ⌘K — ✅ hecho (#21)
- [x] **F-11** PWA instalable + offline — ✅ hecho (#22)
- [x] **F-14** Proyección fin de mes + comparación mensual — ✅ hecho (#23)

### 🟢 P3 — PENDIENTE PARA FUTUROS UPDATES (no en alcance actual)
> Decisión 2026-06-06: P1 y P2 están completos. El P3 queda **congelado**
> hasta después del rediseño visual. Retomar cuando el usuario lo pida.
- [ ] **F-04** Asistente con Claude API (requiere API key + coste) — el "wow" de IA
- [ ] **F-03** Metas híbridas (ahorro + proyecto)
- [ ] **F-06** Resumen "Wrapped" mensual/anual — muy compartible
- [ ] **F-09** Vista Hoy / próximos 7 días
- [ ] **F-12** Notificaciones push (encaja con el PWA ya hecho)
- [ ] **F-15** Exportar / importar JSON-CSV — red de seguridad de datos

---

## ⚙️ Acción de configuración pendiente (fuera del código)
- [ ] Agregar el dominio de producción en **Firebase Console → Authentication →
      Settings → Authorized domains** (necesario para que el login Google funcione
      en el deploy). Ver `JOURNAL.md` entrada del 2026-06-04.
