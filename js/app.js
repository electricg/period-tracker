/* global app, NAMESPACE, DEFAULT_USER_SETTINGS */
'use strict';

const App = function (namespace, settings) {
  this.storage = new app.Storage(namespace);
  this.config = new app.Config(settings, this.storage);
  this.model = new app.Model(this.config, this.storage);
  this.template = new app.Template(this.config);
  this.view = new app.View(this.template);
  this.controller = new app.Controller(this.model, this.view);
  this.offline = new app.Offline({
    showOffline: (status) => this.view.render('offline', status),
    showInfo: (msg) => this.view.render('info', msg),
  });
  this.show = () => {
    this.controller.setSection(document.location.hash);
  };
  this.init = () => {
    this.offline.init();
    this.controller.setData();
    this.show();
  };
};

app.instance = new App(NAMESPACE, DEFAULT_USER_SETTINGS);

if (location.protocol === 'http:' && location.hostname !== 'localhost') {
  const newUrl = location.href.replace('http://', 'https://');
  app.instance.view.render(
    'warning',
    `Warning: this app is better loaded from its <a href="${newUrl}">https counterpart</a>`
  );
}

window.addEventListener('load', app.instance.init);
window.addEventListener('hashchange', app.instance.show);
