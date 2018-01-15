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
var precache = precacheFiles;

self.addEventListener('install', function (evt) {
	console.log('The service worker is being installed.');
	evt.waitUntil(precache().then(function () {
		console.log('[ServiceWorker] Skip waiting on install');
		return self.skipWaiting();

	}));
});


self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request)
		.then(function (response) {
			if (response) {
				return response;
			} else {
				return fetch(event.request)
					.then(function (res) {
						return caches.open(CACHE_DYNAMIC_NAME)
							.then(function (cache) {
								cache.put(event.request.url, res.clone());
								return res;
							})
					})
					.catch(function (err) {
						return caches.open(CACHE_STATIC_NAME)
							.then(function (cache) {
								return cache.match('/offline.html');
							});
					});
			}
		})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		fetch(event.request)
		.then(function (res) {
			return caches.open(CACHE_DYNAMIC_NAME)
				.then(function (cache) {
					cache.put(event.request.url, res.clone());
					return res;
				})
		})
		.catch(function (err) {
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

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});
