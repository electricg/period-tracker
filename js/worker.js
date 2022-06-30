(function (window) {
  'use strict';

  var Worker = function ({ renderOffline, renderInfo }) {
    let isSWInstalled = false;

    /**
     * Show service worker status
     * @param {boolean} status true if sw is active
     */
    const swUIStatus = (status) => {
      renderOffline(status);
      // console.log('sw status', !!status);
    };

    /**
     * Show service worker has been installed for the first time ever
     */
    const swUIFirstTime = () => {
      // console.log('sw first time ever');
      swUIStatus(true);
      swUIMessage('This app is now available offline!');
    };

    /**
     * Show service worker has been installed
     */
    const swUIInstalled = () => {
      // console.log('sw installed');
      swUIStatus(true);
    };

    /**
     * Show that service worker has a new update to show
     */
    const swUIUpdate = () => {
      // console.log('sw there is a new update, please refresh');
      swUIMessage('This app has an update, please refresh.');
    };

    /**
     * Show service worker has returned an error
     * @param {Object} err error
     */
    const swUIError = (err) => {
      console.error('ServiceWorker registration failed: ', err);
    };

    /**
     * Change the sw message
     * @param {string} msg
     */
    const swUIMessage = (msg = '') => {
      renderInfo(msg);
    };

    /**
     * Check if service worker is active
     * @returns {boolean}
     */
    const swCheckStatus = () => {
      return !!navigator.serviceWorker.controller;
    };

    const onStateChange = (newWorker) => {
      // console.log('onStateChange', newWorker.state);
      if (newWorker.state === 'activated') {
        if (!isSWInstalled) {
          isSWInstalled = swCheckStatus();
          swUIFirstTime();
        } else {
          swUIInstalled();
        }
      } else if (
        newWorker.state === 'installed' &&
        navigator.serviceWorker.controller
      ) {
        swUIUpdate();
      }
    };

    this.init = function () {
      if ('serviceWorker' in navigator) {
        isSWInstalled = swCheckStatus();

        if (isSWInstalled) {
          swUIInstalled();
        }

        navigator.serviceWorker
          .register('sw.js')
          .then((registration) => {
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;

              registration.installing.addEventListener('statechange', () =>
                onStateChange(newWorker)
              );
            });
          })
          .catch((err) => {
            swUIError(err);
          });
      }
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.Worker = Worker;
})(window);
