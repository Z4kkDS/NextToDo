# 📓 Bitácora de problemas y soluciones

> Cada entrada: **síntoma → causa → solución**. Si algo costó descubrir, va aquí
> para no volver a sufrirlo. Más reciente arriba.

---

## 2026-06-06 · PWA: el service worker NO debe interceptar auth/Firestore

**Contexto:** al añadir el PWA (F-11), el riesgo es que el service worker cachee
o intercepte el flujo de Google Auth (popup en `*.firebaseapp.com`/`google.com`)
o el tráfico de Firestore (`*.googleapis.com`), rompiendo login y sincronización.

**Regla aplicada en `public/sw.js`:** el `fetch` handler solo interviene
peticiones **GET del mismo origen** y además ignora `/__/auth`. Todo lo
cross-origin pasa directo a la red, sin tocar. Así el login con Google y la
sincronización en tiempo real siguen funcionando con la app instalada.

**Si en el futuro el login falla dentro de la PWA instalada:** revisar primero
que el SW no esté interceptando esas rutas, y recordar que el dominio del deploy
debe estar en Firebase → Authorized domains (ver entrada del 2026-06-04).

---

## 2026-06-05 · recharts 3: el `formatter` del Tooltip no acepta `(value: number)`

**Síntoma:** `next build` fallaba con *"Type '(value: number) => string' is not
assignable to type 'Formatter<ValueType, NameType>'"* en los gráficos.

**Causa:** en recharts 3 el `formatter` del `<Tooltip>` recibe `ValueType`
(`number | string | array`), no `number`. Anotar el parámetro como `number` lo
hace incompatible.

**Solución:** quitar la anotación y coercionar: `formatter={(value) =>
formatCLP(Number(value))}`.

---

## 2026-06-05 · PR #12 "merged" pero el código no llegó a main

**Síntoma:** tras desplegar todos los PRs, la pestaña Finanzas desapareció,
aunque el PR #12 figuraba como "merged".

**Causa:** el PR #12 tenía como base `feat/etapa4-features` en vez de `main`. Se
mergeó a esa rama intermedia, que **ya estaba fusionada a main antes**, así que
el código de finanzas nunca llegó a `main`.

**Solución:** cherry-pick del commit de finanzas (`5dcecd0`) sobre `main` en una
rama nueva (`fix/restore-finance-tab`) → PR #14. Aplicó limpio.

**Prevención:** al crear PRs encadenados, **verificar que la base sea `main`**
(o re-apuntar antes de mergear). `gh pr view <n> --json baseRefName` lo confirma.

---

## 2026-06-04 · Login Google: popup se abría y cerraba sin autenticar

**Síntoma:** al elegir la cuenta de Google, el usuario volvía a `/login` sin
quedar autenticado. Antes, con popup, la ventana se abría y cerraba sola.

**Causa (dos capas):**
1. `signInWithRedirect` guarda la sesión en el dominio `*.firebaseapp.com` del
   handler de redirect; los navegadores que **particionan cookies de terceros**
   (Chrome/Safari) impiden que la app (en otro dominio, p.ej. `*.vercel.app`) la
   lea → `getRedirectResult` vuelve vacío.
2. El error original del popup era casi seguro `auth/unauthorized-domain`, pero
   solo se mandaba a `console.error`, así que no se veía nada.

**Solución:** volver a `signInWithPopup` (PR #13) + mostrar los errores con
`toast` (mensajes claros para `unauthorized-domain` y `popup-blocked`;
`popup-closed-by-user` se ignora). 

**Prevención / acción externa:** el dominio del deploy debe estar en
**Firebase → Authentication → Settings → Authorized domains**. Es config de la
cuenta, no del código.

---

## 2026-06-04 · `gh` CLI no se reconoce en la sesión

**Síntoma:** `gh: command not found` / "no se reconoce como cmdlet".

**Causa:** GitHub CLI instalado en `C:\Program Files\GitHub CLI\` pero ese path
no estaba en el PATH de la sesión activa.

**Solución:** se agregó al PATH en `~/.claude/settings.json` (aplica a sesiones
nuevas). En la sesión actual se invoca con ruta completa:
`"/c/Program Files/GitHub CLI/gh.exe"`.

---

## 2026-06-04 · Error de tipos con `motion` al animar opacity/y

**Síntoma:** `next build` fallaba: *"Object literal may only specify known
properties, and 'opacity' does not exist in type ObjectTarget<HTMLDivElement>"*
en `TodoItemAnimated.tsx`.

**Causa:** la firma de `animate()` de la versión de `motion` instalada no acepta
ciertas combinaciones de keyframes tipadas como se escribieron.

**Solución:** simplificar las llamadas a `animate()` (keyframes mínimos) y
mantener el guard de `prefers-reduced-motion`.

---

## (preexistente) · `next build` falla en prerender de /dashboard y /login

**Síntoma:** el build local termina con `FirebaseError: auth/invalid-api-key` al
prerenderizar páginas que usan Firebase.

**Causa:** falta `.env.local` con las claves `NEXT_PUBLIC_FIREBASE_*` en el
entorno local. **No es una regresión** del código.

**Solución / nota:** el paso `✓ Compiled successfully` + type-check en verde es
la señal de que el código está bien. En Vercel el build pasa porque las env vars
están configuradas. Para build local completo, crear `.env.local` con claves
válidas (o dummy que no rompan la inicialización).
