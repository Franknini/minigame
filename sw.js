var CACHE_NAME = 'yinian-v1';
var urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(urlsToCache);
    }).catch(function(err){
      console.log('快取失敗：', err);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.map(function(name){
          if (name !== CACHE_NAME){
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response){
      return response || fetch(event.request).then(function(networkRes){
        return caches.open(CACHE_NAME).then(function(cache){
          if (event.request.method === 'GET' && event.request.url.indexOf('http') === 0){
            cache.put(event.request, networkRes.clone());
          }
          return networkRes;
        });
      }).catch(function(){
        return caches.match('./index.html');
      });
    })
  );
});
