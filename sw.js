/* Ясен Пень — офлайн. Версия 05de74b7f8. Оболочка кэшируется при установке, записи голоса — при первом проигрывании. */
const V='yp-05de74b7f8',SHELL=["./","index.html","manifest.webmanifest","privacy.html","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/apple-touch-icon.png","audio/manifest.json"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 /* манифест голоса — сначала сеть (чтобы новые записи подхватывались), без сети — кэш */
 if(u.pathname.endsWith('/audio/manifest.json')){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match(r)));return;}
 /* записи голоса: запросы с Range (перемотка) отдаём из сети, остальное кэшируем */
 if(u.pathname.includes('/audio/')){if(r.headers.has('range'))return;e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{if(res.ok&&res.status===200){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));}return res;})));return;}
 /* оболочка: кэш, потом сеть; страницу без сети — из кэша */
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(h=>h||fetch(r).catch(()=>r.mode==='navigate'?caches.match('index.html'):undefined)));});
