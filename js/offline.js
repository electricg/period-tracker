'use strict';

(function (window) {
  const Offline = function ({
    showOffline = () => {},
    showInfo = () => {},
    showInstall = () => {},
    showUninstall = () => {},
    registerFile = 'sw.js',
    msgInstalled = 'This app is now available offline!',
    msgUpdated = 'This app has an update, please refresh.',
  }) {
    console.debug('debug: sw started');
    let isSWInstalled = false;
    let isSWInstallable = false;

    let deferredPrompt = null;

    this.install = async function (e) {
      console.log('event install', e);
      console.log(deferredPrompt);

      if (deferredPrompt) {
        // deferredPrompt is a global variable we've been using in the sample to capture the `beforeinstallevent`
        deferredPrompt.prompt();
        // Find out whether the user confirmed the installation or not
        const { outcome } = await deferredPrompt.userChoice;
        // The deferredPrompt can only be used once.
        deferredPrompt = null;
        console.log('this', installServiceWorker);
        // Act on the user's choice
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt.');
          installServiceWorker(); // TODO maybe there's a better way to call it?
        } else if (outcome === 'dismissed') {
          console.log('User dismissed the install prompt');
        }
      }
    };

    this.uninstall = function (e) {
      console.log('event uninstall', e);

      if (window.confirm('Uninstall?')) {
        uninstallServiceWorker();
      }
    };

    /**
     * Show service worker status
     * @param {boolean} status true if sw is active
     */
    const swUIStatus = (status) => {
      console.debug('debug: sw status', !!status);
      showOffline(status);
      if (status) {
        showUninstall();
      } else {
        showInstall();
      }
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
     * Return if the service worker is installed
     * @returns {boolean}
     */
    this.isInstalled = function () {
      console.log('is installed?', isSWInstalled);
      return isSWInstalled;
    };

    /**
     * Return if the service worker is installable
     * @returns {boolean}
     */
    this.isInstallable = function () {
      console.log('is installable', isSWInstallable);
      return isSWInstallable;
    };

    this.handleBeforeInstallPrompt = function (event) {
      console.debug('debug: sw beforeinstallprompt', event);

      // Prevents the default mini-infobar or install dialog from appearing on mobile
      event.preventDefault();
      // Save the event because you'll need to trigger it later.
      deferredPrompt = event;
    };

    /**
     * Start the service worker
     */
    this.init = function () {
      console.debug('debug: sw offline init');
      if ('serviceWorker' in navigator) {
        isSWInstalled = swCheckStatus();

        if (isSWInstalled) {
          swUIInstalled();
        }
      }

      if (isSWInstalled) {
        showUninstall();
      }
      if (isSWInstallable) {
        showInstall();
      }
      window.addEventListener('sw:install', this.install);
      window.addEventListener('sw:uninstall', this.uninstall);
    };

    /**
     * Send message object to the service worker
     * @param {object} message
     */
    const sendMessage = (message) => {
      navigator.serviceWorker.controller.postMessage(message);
    };

    /**
     * Install the service worker
     */
    const installServiceWorker = function () {
      console.debug('debug: sw install');
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
     * Unregister service worker and send message to delete all caches
     */
    const uninstallServiceWorker = async () => {
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
