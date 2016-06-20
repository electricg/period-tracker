(function(window) {
  'use strict';

  /**
   * Take a model and view and acts as the controller between them
   * @param {object} model The model instance
   * @param {object} view The view instance
   */
  var Controller = function(model, view) {
    var _self = this;
    _self.model = model;
    _self.view = view;

    /**
     * Show the selected section
     * @param {string} locationHash
     */
    this.setSection = function(locationHash) {
      var args = locationHash.split('/');
      args.shift();
      var section = args.shift();
      _self.view.render('section', _self.model, section, args);
    };

    /**
     * Insert data into the views
     */
    this.setData = function() {
      _self.view.render('home', _self.model);
      _self.view.render('log', _self.model);
      _self.view.render('settings');
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);