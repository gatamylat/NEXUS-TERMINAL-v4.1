// NEXUS TERMINAL - Service Worker v4.1
const CACHE_NAME = 'nexus-v4.1';
const CACHE_FILES = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(c => c.addAll(CACHE_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    if (!e.request.url.startsWith(self.location.origin)) return;
    
    e.respondWith(
        fetch(e.request)
            .then(r => {
                if (r && r.status === 200) {
                    const clone = r.clone();
                    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                }
                return r;
            })
            .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
});
