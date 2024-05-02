const VERSION = '0.11.5';
const cacheName = `v${VERSION}::static`;

const fileList = `
./
css/main.css
images/icon.svg
js/settings.js
`
  .trim()
  .split('\n')
  .filter(Boolean);

const downloadCache = () => {
  caches
    .open(cacheName)
    .then((cache) => {
      return cache
        .addAll(
          fileList.map((file) => new Request(file, { cache: 'no-cache' }))
        )
        .then(() => {
          self.skipWaiting();
        });
    })
    .then(() => {
      console.log(`downloaded cache ${VERSION}`);
    });
};

const clearAllCaches = () =>
  caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));

self.addEventListener('install', (event) => {
  console.log('Service worker installed', event);
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated', event);
});

self.addEventListener('message', (event) => {
  console.log('sw received message:', event);

  if (event.data.type === 'clear') {
    console.log('delete all caches');
    clearAllCaches();
  }

  if (event.data.type === 'download') {
    console.log('download files');
    downloadCache();
  }
});
