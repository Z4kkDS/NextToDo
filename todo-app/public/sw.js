// Service worker mínimo para NexToDo (PWA).
// REGLA CLAVE: solo intervenimos peticiones GET del MISMO origen. Todo lo
// cross-origin (Google Auth en *.firebaseapp.com / *.google.com, Firestore en
// *.googleapis.com, etc.) se deja pasar SIN tocar, para no romper el login ni
// la sincronización en tiempo real.

const CACHE = "nextodo-v1";
const APP_SHELL = ["/", "/dashboard", "/login", "/icon.svg", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Solo GET.
  if (request.method !== "GET") return;
  // 2. Solo mismo origen: NO interceptamos auth de Google ni Firestore.
  if (url.origin !== self.location.origin) return;
  // 3. No interceptar rutas del handler de auth de Firebase, por si acaso.
  if (url.pathname.startsWith("/__/auth")) return;

  // Navegaciones (documentos): network-first con fallback a caché.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/dashboard")))
    );
    return;
  }

  // Estáticos del mismo origen: cache-first.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          if (res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
