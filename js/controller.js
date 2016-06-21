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
    _self.settings = _self.view.settings;

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

    this.addItem = function(date) {
      _self.model.add(date);
      _self.setData();
    };

    this.removeItem = function(id) {
      _self.model.remove(id);
      _self.setData();
    };

    this.editItem = function(id) {
      console.log(id);return;
      _self.model.edit(id);
      _self.setData();
    };

    this.removeAllItem = function() {
      console.log('ALL');return;
      _self.model.drop();
      _self.setData();
    };

    this.updateSettings = function(data) {
      _self.settings.update(data);
      _self.model.update();
      _self.setData();
    };

    _self.view.bind('itemAdd', function(date) {
      _self.addItem(date);
    });

    _self.view.bind('itemRemove', function(id) {
      _self.removeItem(id);
    });

    _self.view.bind('itemEdit', function(id) {
      _self.editItem(id);
    });

    _self.view.bind('itemRemoveAll', function() {
      _self.removeAllItem();
    });

    _self.view.bind('settingsUpdate', function(data) {
      _self.updateSettings(data);
    });
  };

  // export to window
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);