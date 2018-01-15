//This is the service worker with the Cache-first network
var CACHE_STATIC_NAME = 'static-v40';
var CACHE_DYNAMIC_NAME = 'dynamic-v3';
var CACHE = 'pwabuilder-precache';
var precacheFiles = [
	 '/',
  '/index.html',
	'/404.html',
	'/offline.html',
  '/js/webmidi.js'
      /* Add an array of files to precache for your app */
    ];


self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');
  evt.waitUntil(precache().then(function() {
    console.log('[ServiceWorker] Skip waiting on install');
      return self.skipWaiting();

  })
  );
});


//allow sw to control of current page
self.addEventListener('activate', function(event) {
console.log('[ServiceWorker] Claiming clients for current page');
      return self.clients.claim();

});

 self.addEventListener('fetch', function(event) {
   event.respondWith(
     caches.match(event.request)
       .then(function(response) {
         if (response) {
           return response;
         } else {
           return fetch(event.request)
             .then(function(res) {
               return caches.open(CACHE_DYNAMIC_NAME)
                 .then(function(cache) {
                   cache.put(event.request.url, res.clone());
                   return res;
                 })
             })
             .catch(function(err) {
               return caches.open(CACHE_STATIC_NAME)
                 .then(function(cache) {
                   return cache.match('/offline.html');
                 });
             });
         }
       })
   );
 });

 self.addEventListener('fetch', function(event) {
   event.respondWith(
     fetch(event.request)
       .then(function(res) {
         return caches.open(CACHE_DYNAMIC_NAME)
                 .then(function(cache) {
                   cache.put(event.request.url, res.clone());
                   return res;
                 })
       })
       .catch(function(err) {
         return caches.match(event.request);
       })
   );
 });

 //Cache-only
 self.addEventListener('fetch', function (event) {
   event.respondWith(
     caches.match(event.request)
   );
 });

 //Network-only
 self.addEventListener('fetch', function (event) {
   event.respondWith(
     fetch(event.request)
   );
 });

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});



//Install stage sets up the cache-array to configure pre-cache content

self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');
  evt.waitUntil(precache().then(function() {
    console.log('[ServiceWorker] Skip waiting on install');
      return self.skipWaiting();

  })
  );
});


//allow sw to control of current page
self.addEventListener('activate', function(event) {
console.log('[ServiceWorker] Claiming clients for current page');
      return self.clients.claim();

});

self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.'+ evt.request.url);
  evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
  evt.waitUntil(update(evt.request));
});


function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(precacheFiles);
  });
}


function fromCache(request) {
  //we pull files from the cache first thing so we can show them fast
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

/*self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function(cache) {
      return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
      });
    })
  );
});*/


function update(request) {
  //this is where we call the server to get the newest version of the 
  //file to use the next time we show view
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

function fromServer(request){
  //this is the fallback if it is not in the cahche to go to the server and get it
return fetch(request).then(function(response){ return response})
}

