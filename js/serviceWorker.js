// Nome do cache
const CACHE_NAME = 'v1_cache_images';

// Arquivos a serem armazenados no cache inicialmente
const cacheAssets = [
 // './index.html',
 // './app.js',
  //'./style.css',
  // Você pode adicionar imagens estáticas aqui também
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Fazendo cache dos arquivos');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Ativado');

  // Remover caches antigos se necessário
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpando cache antigo');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptar requisições de rede (fetch)
self.addEventListener('fetch', event => {
  // Verifica se a requisição é de uma imagem
  if (event.request.url.includes('.jpg') || event.request.url.includes('.png') || event.request.url.includes('.jpeg') || event.request.url.includes('.gif')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            // Se a imagem já está no cache, a retorna
            return response;
          }

          // Se a imagem não está no cache, busca na rede
          return fetch(event.request).then(fetchResponse => {
            return caches.open(CACHE_NAME).then(cache => {
              // Armazena a nova imagem no cache
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          });
        }).catch(() => {
          // Se estiver offline e não tiver a imagem no cache, retorna uma imagem de fallback (opcional)
          return caches.match('./fallback.jpg');
        })
    );
  } else {
    // Para outras requisições (não imagens), o comportamento padrão
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
  }
});
