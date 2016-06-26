/* global app, namespace, defaultSettings, features, gcalClientId, gcalScopes, gcalTitle, gcalOnload */
var Tracker = function(namespace, settings) {
  this.config = new app.Config(namespace, settings);
  this.model = new app.Model(namespace, this.config);
  this.template = new app.Template(this.config);
  this.view = new app.View(this.template);
  this.gcal = new app.Gcal(gcalClientId, gcalScopes, gcalTitle, namespace, gcalOnload);
  this.controller = new app.Controller(this.model, this.view, this.gcal);
};

var tracker = new Tracker(namespace, defaultSettings);

var show = function() {
  tracker.controller.setSection(document.location.hash);
};

var load = function() {
  tracker.controller.setData();
  show();
  if (features.gcal) {
    tracker.gcal.firstLoad();
  }
};

window.addEventListener('load', load);
window.addEventListener('hashchange', show);



function onFirstLoad() {
  var msg = 'ready to work offline';
  console.log(msg);
  // the very first activation!
  // tell the user stuff works offline
  tracker.view.render('info', msg);
  tracker.view.render('offline', true);
}

function onClaimed() {
  console.log('sw claimed');
  navigator.serviceWorker.controller.postMessage({
    type: 'claimed',
    value: true
  });
}

function onInstalled() {
  console.log('sw installed');
}

function onStateChange(newWorker) {
  if (newWorker.state === 'activated') {
    onFirstLoad();
    if (navigator.serviceWorker.controller) {
      onClaimed();
    }
  }
  else if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
    onInstalled();
  }
}

function onUpdateFound(registration) {
  var newWorker = registration.installing;

  registration.installing.addEventListener('statechange',
    () => onStateChange(newWorker));
}

if (features.offline) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
      registration.addEventListener('updatefound', () => onUpdateFound(registration));
      if (registration.active && registration.active.state === 'activated') {
        tracker.view.render('offline', true);
      }
    }).catch(function(err) {
      console.error('ServiceWorker registration failed: ', err);
    });
  }
}
