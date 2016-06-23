/* global app */
/* exported loadGcal */
const namespace = 'periodTracker';

const gcalClientId = '264231513776-rbc9gpga3hsi244dodlt96crcmf99141.apps.googleusercontent.com';
const gcalScopes = ['https://www.googleapis.com/auth/calendar'];
const gcalNamespace = 'Period Tracker';

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
  // this.gcal = new app.Gcal(gcalClientId, gcalScopes, gcalNamespace);
  this.controller = new app.Controller(this.model, this.view);
};

var tracker = new Tracker(namespace);

var show = function() {
  tracker.controller.setSection(document.location.hash);
};

var load = function() {
  tracker.controller.setData();
  show();
  // var el = document.createElement('script');
  // el.setAttribute('src', 'https://apis.google.com/js/client.js');
  // document.body.appendChild(el);
};

// var loadGcal = function() {
//   // tracker.gcal.checkAuth(function(res) {
//   //   console.log(res);
//   //   tracker.view.render('gcal', true);
//   // });
//   tracker.gcal.checkAuth()
//   .then(function(res) {
//     console.log(res);
//     tracker.view.render('gcal', true);
//   });
// };

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
