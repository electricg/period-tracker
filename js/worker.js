(function (window) {
  'use strict';

  const Offline = function ({
    showOffline = () => {},
    showInfo = () => {},
    debug = false,
    registerFile = 'sw.js',
    msgInstalled = 'This app is now available offline!',
    msgUpdated = 'This app has an update, please refresh.',
  }) {
    debug && console.log('debug: on');
    let isSWInstalled = false;

    /**
     * Show service worker status
     * @param {boolean} status true if sw is active
     */
    const swUIStatus = (status) => {
      debug && console.log('debug: sw status', !!status);
      showOffline(status);
    };

    /**
     * Show service worker has been installed for the first time ever
     */
    const swUIFirstTime = () => {
      debug && console.log('debug: sw first time ever');
      swUIStatus(true);
      swUIMessage(msgInstalled);
    };

    /**
     * Show service worker has been installed
     */
    const swUIInstalled = () => {
      debug && console.log('debug: sw installed');
      swUIStatus(true);
    };

    /**
     * Show that service worker has a new update to show
     */
    const swUIUpdate = () => {
      debug && console.log('debug: sw there is a new update, please refresh');
      swUIMessage(msgUpdated);
    };

    /**
     * Show service worker has returned an error
     * @param {Object} err error
     */
    const swUIError = (err) => {
      debug && console.error('debug: sw registration failed: ', err);
    };

    /**
     * Change the sw message
     * @param {string} msg
     */
    const swUIMessage = (msg) => {
      showInfo(msg);
    };

    /**
     * Check if service worker is active
     * @returns {boolean}
     */
    const swCheckStatus = () => {
      return !!navigator.serviceWorker.controller;
    };

    const onStateChange = (newWorker) => {
      debug && console.log('debug: sw onStateChange', newWorker.state);
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

    const init = function () {
      if ('serviceWorker' in navigator) {
        isSWInstalled = swCheckStatus();

        if (isSWInstalled) {
          swUIInstalled();
        }

        navigator.serviceWorker
          .register(registerFile)
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

    init();
  };

  // export to window
  window.app = window.app || {};
  window.app.Offline = Offline;
})(window);
