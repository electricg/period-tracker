/* global app */
/* exported loadGcal */
const namespace = 'periodTracker';

const _OFFLINE = 1;

var defaultSettings = {
  startDayOkWeek: 1, // 0 Sunday, 1 Monday
  periodLength: 4,
  cycleLength: 28
};

var Tracker = function(namespace) {
  this.settings = new app.Settings(namespace, defaultSettings);
  this.model = new app.Model(namespace, this.settings);
  this.template = new app.Template(this.settings);
  this.view = new app.View(this.template);
  this.controller = new app.Controller(this.model, this.view);
};

var tracker = new Tracker(namespace);

var show = function() {
  tracker.controller.setSection(document.location.hash);
};

var load = function() {
  tracker.controller.setData();
  show();
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

if (_OFFLINE) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
      registration.addEventListener('updatefound', () => onUpdateFound(registration));
      if (registration.active && registration.active.state === 'activated') {
        tracker.view.render('offline', true);
      }
    }).catch(function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  }
}
