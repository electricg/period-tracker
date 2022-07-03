/* global self, caches, version */
self.importScripts('js/settings.js');
const cacheName = `v${version}::static`;

const fileList = `
./
css/main.css
images/icon.svg
js/app.js
js/config.js
js/controller.js
js/helpers.js
js/model.js
js/offline.js
js/settings.js
js/storage.js
js/template.js
js/view.js
vendor/moment-2.13.0.min.js
manifest.webmanifest
`
  .trim()
  .split('\n')
  .filter(Boolean);

self.addEventListener('install', (e) => {
  // once the SW is installed, go ahead and fetch the resources
  // to make this work offline
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        return cache.addAll(fileList).then(() => {
          self.skipWaiting();
        });
      })
      .then(() => {
        console.log(`offline ${version} ready 🎉`);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // when the browser fetches a url, either response with the cached object
  // or go ahead and fetch the actual url and add it to the cache at the same time
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      const url = event.request;
      return cache
        .match(url)
        .then((res) => {
          return (
            res ||
            fetch(url).then((response) => {
              cache.put(url, response.clone());
              return response;
            })
          );
        })
        .catch((error) => {
          // console.log(error); // swallow error
        });
    })
  );
});

const clearOldCaches = () => {
  return caches.keys().then((keys) => {
    return Promise.all(
      keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
    );
  });
};

self.addEventListener('activate', (event) => {
  event.waitUntil(clearOldCaches().then(() => self.clients.claim()));
});
