/* global app */
var namespace = 'periodTracker';

var Tracker = function(namespace) {
  this.model = new app.Model(namespace);
  this.template = new app.Template({
    startDayOkWeek: 1
  });
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