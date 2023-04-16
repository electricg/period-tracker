const VERSION = '0.11.1';
const cacheName = `v${VERSION}::static`;

const fileList = `
./
css/main.css
images/icon.svg
js/app.js
js/calendar.js
js/config.js
js/controller.js
js/dates.js
js/helpers.js
js/model.js
js/offline.js
js/settings.js
js/storage.js
js/template.js
js/view.js
vendor/moment-2.29.4.min.js
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
        console.log(`offline ${VERSION} ready 🎉`);
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
              // check if request is made by chrome extensions or web page, because of some installed chrome extension, service worker throws the error `TypeError: Request scheme 'chrome-extension' is unsupported`
              // https://stackoverflow.com/questions/49157622/service-worker-typeerror-when-opening-chrome-extension
              if (url.url.startsWith('http')) {
                cache.put(url, response.clone());
              }
              return response;
            })
          );
        })
        .catch((error) => {
          console.log(error);
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

const clearAllCaches = () =>
  caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));

self.addEventListener('activate', (event) => {
  event.waitUntil(clearOldCaches().then(() => self.clients.claim()));
});

self.addEventListener('message', (event) => {
  console.log('sw received message:', event);
  if (event.data.type === 'clear') {
    console.log('delete all caches');
    clearAllCaches();
  }
});
