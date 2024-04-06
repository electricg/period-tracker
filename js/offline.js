'use strict';

(function (window) {
  const Offline = function ({
    showOffline = () => {},
    showInfo = () => {},
    registerFile = 'sw.js',
    msgInstalled = 'This app is now available offline!',
    msgUpdated = 'This app has an update, please refresh.',
  }) {
    console.debug('debug: sw on');
    let isSWInstalled = false;

    /**
     * Show service worker status
     * @param {boolean} status true if sw is active
     */
    const swUIStatus = (status) => {
      console.debug('debug: sw status', !!status);
      showOffline(status);
    };

    /**
     * Show service worker has been installed for the first time ever
     */
    const swUIFirstTime = () => {
      console.debug('debug: sw first time ever');
      swUIStatus(true);
      swUIMessage(msgInstalled);
    };

    /**
     * Show service worker has been installed
     */
    const swUIInstalled = () => {
      console.debug('debug: sw installed');
      swUIStatus(true);
    };

    /**
     * Show that service worker has a new update to show
     */
    const swUIUpdate = () => {
      console.debug('debug: sw there is a new update, please refresh');
      swUIMessage(msgUpdated);
    };

    /**
     * Show service worker has returned an error
     * To test it, change the value of `registerFile` to some non existant file
     * @param {Object} err error
     */
    const swUIError = (err) => {
      console.debug('debug: sw registration failed❗️', err);
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
      console.debug('debug: sw onStateChange', newWorker.state);
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

    /**
     * Start the service worker
     */
    this.init = function () {
      if ('serviceWorker' in navigator) {
        isSWInstalled = swCheckStatus();

        if (isSWInstalled) {
          swUIInstalled();
        }
      }
    };

    /**
     * Install the service worker
     */
    this.install = function () {
      console.log('sw install');
      if ('serviceWorker' in navigator) {
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

    /**
     * Send message object to the service worker
     * @param {object} message
     */
    const sendMessage = (message) => {
      navigator.serviceWorker.controller.postMessage(message);
    };

    /**
     * Unregister service worker and send message to delete all caches
     */
    this.uninstall = async () => {
      // TODO check that's installed first?
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const unregisterPromises = registrations.map((registration) =>
          registration.unregister()
        );
        await Promise.all([...unregisterPromises]);
        sendMessage({
          type: 'clear',
        });
      }
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.Offline = Offline;
})(window);
