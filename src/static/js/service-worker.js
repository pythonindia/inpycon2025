
const CACHE_NAME = 'inpycon2025-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  // include other HTML pages, CSS, JS, icons
  '/img/icon/icon_192.png',
  '/img/icon/icon_512.png'
];

self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assetsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', ev => {
  ev.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', ev => {
  ev.respondWith(
    caches.match(ev.request).then(resp => resp || fetch(ev.request))
  );
});
