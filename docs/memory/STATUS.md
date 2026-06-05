# 📊 Estado del proyecto

> Tablero único de verdad. IDs referencian `../SPECS.md`.
> Última actualización: 2026-06-05 · `main` en commit `699fbc1`.

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

---

## 🔄 En curso

_Ninguna feature en curso. Siguiente paso: revisar specs y asignar prioridades._

---

## 📋 Pendiente (backlog priorizado)

Priorizado en sesión 2026-06-05.

### 🔴 P1 — próxima ola
- [ ] **F-01** Tareas con costo (puente tareas↔finanzas) — *el diferenciador central*
- [ ] **F-05** Consejos inteligentes (motor de reglas + semáforo) — *cierra Finanzas, sin deps*
- [ ] **F-13** Gráficos en Finanzas (dona + tendencia) — *requiere recharts*
- [ ] **F-07** Tareas recurrentes — *la más pedida en todo apps*

### 🟡 P2 — siguiente
- [ ] **F-02** Gastos recurrentes → recordatorios (depende de F-01/F-07)
- [ ] **F-08** Subtareas / checklist
- [ ] **F-10** Command palette ⌘K
- [ ] **F-11** PWA instalable + offline
- [ ] **F-14** Proyección fin de mes + comparación mensual

### 🟢 P3 — más adelante / requieren decisión
- [ ] **F-04** Asistente con Claude API (requiere API key + coste)
- [ ] **F-03** Metas híbridas (ahorro + proyecto)
- [ ] **F-06** Resumen "Wrapped" mensual/anual
- [ ] **F-09** Vista Hoy / próximos 7 días
- [ ] **F-12** Notificaciones push
- [ ] **F-15** Exportar / importar JSON-CSV

---

## ⚙️ Acción de configuración pendiente (fuera del código)
- [ ] Agregar el dominio de producción en **Firebase Console → Authentication →
      Settings → Authorized domains** (necesario para que el login Google funcione
      en el deploy). Ver `JOURNAL.md` entrada del 2026-06-04.
