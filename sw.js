/* ELOBAD — Service Worker — By Quentin Delisle */
const CACHE = 'elobad-cache-v2';
const CORE_ASSETS = ['./index.html', './style.css', './app.js', './manifest.json'];
const STATIC_ASSETS = [
  './', './logo.png', './logo-lmc-icon.png',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll([...CORE_ASSETS, ...STATIC_ASSETS])).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

function isCoreAsset(url){
  return CORE_ASSETS.some(a => url.endsWith(a.replace('./','/')) || url.endsWith(a.replace('./','')));
}

self.addEventListener('fetch', (e)=>{
  if(e.request.method !== 'GET') return;
  const url = e.request.url;
  const sameOrigin = url.startsWith(self.location.origin);

  // App shell (HTML/CSS/JS) : réseau en priorité pour toujours avoir la dernière version,
  // avec repli sur le cache si hors-ligne.
  if(sameOrigin && (e.request.mode === 'navigate' || isCoreAsset(url))){
    e.respondWith(
      fetch(e.request).then(networkResp=>{
        if(networkResp && networkResp.status===200){
          const clone = networkResp.clone();
          caches.open(CACHE).then(c=>c.put(e.request, clone));
        }
        return networkResp;
      }).catch(()=> caches.match(e.request).then(r=> r || caches.match('./index.html')))
    );
    return;
  }

  // Assets statiques (logos, icônes) : cache en priorité, mise à jour en tâche de fond.
  e.respondWith(
    caches.match(e.request).then(cached=>{
      const fetchPromise = fetch(e.request).then(networkResp=>{
        if(networkResp && networkResp.status===200 && sameOrigin){
          const clone = networkResp.clone();
          caches.open(CACHE).then(c=>c.put(e.request, clone));
        }
        return networkResp;
      }).catch(()=> cached);
      return cached || fetchPromise;
    })
  );
});
