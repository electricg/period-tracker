/* global version */
const cacheName = 'v1::static';

var fileList = [
  '/period-tracker/',
  'css/main.css',
  'js/app.js',
  'js/controller.js',
  'js/helpers.js',
  'js/model.js',
  'js/settings.js',
  'js/template.js',
  'js/view.js',
  'vendor/moment-2.13.0.min.js',
  'vendor/moment-range-2.2.0.min.js',
  'sw.js'
];

self.addEventListener('install', e => {
  // once the SW is installed, go ahead and fetch the resources
  // to make this work offline
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(fileList).then(() => self.skipWaiting());
    })
  );
});

// when the browser fetches a url, either response with
// the cached object or go ahead and fetch the actual url
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});