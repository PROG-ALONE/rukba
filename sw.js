/* عامل الخدمة: يخلي التطبيق يشتغل بدون إنترنت. غيّر رقم النسخة بعد كل تحديث للملفات. */
const CACHE = 'rukba-v2.2.0';
const SHELL = ['./', 'index.html', 'data.json', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'apple-touch-icon.png', 'xray-both.jpg', 'xray-zoom.jpg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname === 'api.github.com' || u.hostname.endsWith('githubusercontent.com')) return;
  if (u.origin === location.origin) {
    // الشبكة أولاً (حتى توصلك التحديثات)، وإذا ماكو إنترنت فمن الكاش
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
  } else if (u.hostname.includes('fonts.g')) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); return res; })));
  }
});
