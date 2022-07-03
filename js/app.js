/* global app, namespace, defaultSettings, features */
var Tracker = function (namespace, settings) {
  this.storage = new app.Storage(namespace);
  this.config = new app.Config(settings, this.storage);
  this.model = new app.Model(this.config, this.storage);
  this.template = new app.Template(this.config);
  this.view = new app.View(this.template);
  this.controller = new app.Controller(this.model, this.view);
};

var tracker = new Tracker(namespace, defaultSettings);

var show = function () {
  tracker.controller.setSection(document.location.hash);
};

var load = function () {
  tracker.controller.setData();
  show();
};

if (location.protocol === 'http:' && location.hostname !== 'localhost') {
  const newUrl = location.href.replace('http://', 'https://');
  tracker.view.render(
    'warning',
    `Warning: this app is better loaded from its <a href="${newUrl}">https counterpart</a>`
  );
}

window.addEventListener('load', load);
window.addEventListener('hashchange', show);

if (features.offline) {
  new app.Offline({
    showOffline: (status) => tracker.view.render('offline', status),
    showInfo: (msg) => tracker.view.render('info', msg),
  });
}
