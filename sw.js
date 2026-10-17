/* Keeps the launcher's own files (icon, splash) on the phone so the app opens instantly; the channel data always comes live from Google. */
const C = 'lff-launcher-v2', FILES = ['./', 'index.html', 'manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())) });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())) });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return; // Google's pages: never cached
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); return r }).catch(() => caches.match(e.request)));
});
