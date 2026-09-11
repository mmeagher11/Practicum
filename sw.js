/* Service worker - offline support for the Diagnostic.
   Strategy: network first, cache as fallback. When the practitioner is online they
   always get the current build; when offline, the last good copy is served from cache.
   Bump CACHE whenever any listed asset changes so stale caches are cleared. */
const CACHE = 'oss-diagnostic-v2.5.3';
const ASSETS = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'data.js',
  'resources.json',
  'manifest.webmanifest',
  'assets/icon.svg',
  'fonts/sora-latin-700-normal.woff2',
  'fonts/sora-latin-800-normal.woff2',
  'fonts/inter-latin-400-normal.woff2',
  'fonts/inter-latin-700-normal.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      /* cache: 'reload' bypasses the browser HTTP cache so the precache is never
         seeded with a stale copy of a file that changed in this release. */
      Promise.all(ASSETS.map(url =>
        fetch(new Request(url, { cache: 'reload' }))
          .then(res => { if (res.ok) return cache.put(url, res); })
          .catch(() => { /* offline during install: fill lazily on fetch */ })
      ))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle same-origin GET requests; nothing ever leaves the origin.
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(cached =>
          cached || (event.request.mode === 'navigate' ? caches.match('./') : undefined)
        )
      )
  );
});
