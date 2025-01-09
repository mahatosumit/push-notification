// public/service-worker.js
const CACHE_NAME = 'push-notifications-app-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo.png',
  '/logo.png',
  '/manifest.json',
  '/src/main.js',
  // Add other essential assets here
];

// Install event - Cache important resources for offline use
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - Clear old caches if necessary
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});

// Fetch event - Serve resources from cache for offline use
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Serve cached content if available
      }
      return fetch(event.request); // Otherwise fetch from network
    })
  );
});

// Push notification event - Handle incoming push messages
self.addEventListener('push', function (event) {
  const options = {
    body: event.data.text(),
    icon: '/logo.png',
    badge: '/badge.png',
  };

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
