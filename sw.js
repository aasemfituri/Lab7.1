// sw.js - Service Worker
// Code below obtained from
// https://developers.google.com/web/fundamentals/primers/service-workers
// You will need 3 event listeners:
//   - One for installation
//   - One for activation ( check out MDN's clients.claim() for this step )
//   - One for fetch requests

let cacheList = ['https://cse110lab6.herokuapp.com/entries'];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
      caches.open('cache_1')
        .then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(cacheList);
        })
    );
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();
  
              caches.open('cache_1')
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
