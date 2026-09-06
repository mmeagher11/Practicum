/* Service worker - caches all static assets for offline use.
   Bump CACHE whenever any listed asset changes so clients pick up the new build. */
const CACHE = 'oss-diagnostic-v2.5';
const ASSETS = [
  '.',
  'index.html',
  'styles.css',
  'app.js',
  'data.js',
  'resources.json',
  'manifest.webmanifest',
  'assets/oin-logo-landscape.svg',
  'assets/icon.svg',
  'fonts/sora-latin-700-normal.woff2',
  'fonts/sora-latin-800-normal.woff2',
  'fonts/inter-latin-400-normal.woff2',
  'fonts/inter-latin-700-normal.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Only handle same-origin GET requests; nothing ever leaves the origin.
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
