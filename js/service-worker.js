// service-worker.js

const CACHE_NAME = 'artist-search-cache';

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Verifica se a requisição é para a API 'artist.search'
  const url = event.request.url;

  // Verificar se a URL é da API artist.search
  if (url.includes('https://ws.audioscrobbler.com/2.0/?method=artist.search')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Se a resposta estiver no cache, retorna do cache
        if (cachedResponse) {
          console.log('Resposta da API vindo do cache:', event.request.url);
          return cachedResponse;
        }

        // Se não estiver no cache, faz a requisição de rede
        return fetch(event.request)
          .then((response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Armazenar a resposta no cache
            return caches.open(CACHE_NAME).then((cache) => {
              console.log('Armazenando a resposta da API no cache:', event.request.url);
              cache.put(event.request, response.clone()); // Armazena a resposta
              return response;
            });
          });
      })
    );
  }
});
