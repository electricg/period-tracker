(function(window) {
  'use strict';

  /**
   * Take a model and view and acts as the controller between them
   * @param {object} model The model instance
   * @param {object} view The view instance
   */
  var Controller = function(model, view, remote) {
    var _self = this;
    _self.model = model;
    _self.view = view;
    _self.settings = _self.view.settings;
    _self.remote = remote;

    window[_self.remote.onload] = function() {
      window.dispatchEvent(new Event('gcal'));
    };

    window.addEventListener('gcal', function() {
      _self.remote.checkAuth(true)
      .catch(function() {
        return _self.remote.checkAuth(false);
      })
      .then(function(res) {
        _self.view.render('gcal', res.user);
        // TODO: sync data
        _self.model.sync(res.events);
        _self.setData();
      }, function(err) {
        console.error(err);
        _self.view.render('gcal', false);
      });
    });

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
      var res = _self.model.add(date);
      if (res !== -1) {
        _self.setData();
        _self.remote.add(res, function(result) {
          console.log(result);
        });
      }
      else {
        _self.view.render('error', 'Error adding entry');
      }
      return res;
    };

    this.removeItem = function(id) {
      var res = _self.model.remove(id);
      if (res !== -1) {
        _self.setData();
        _self.remote.remove(id, function(result) {
          console.log(result);
        });
      }
      else {
        _self.view.render('error', 'Error removing entry');
      }
      return res;
    };

    this.editItem = function(id, date) {
      var res = _self.model.edit(id, date);
      if (res !== -1) {
        _self.setData();
        _self.remote.edit(id, res, function(result) {
          console.log(result);
        });
      }
      else {
        _self.view.render('error', 'Error editing entry');
      }
      return res;
    };

    this.removeAllItem = function() {
      var res = _self.model.clear();
      if (res !== -1) {
        _self.setData();
        _self.remote.clear(function(result) {
          console.log(result);
        });
      }
      else {
        _self.view.render('error', 'Error removing all entries');
      }
      return res;
    };

    this.updateSettings = function(data) {
      _self.settings.update(data);
      _self.model.calc();
      _self.setData();
    };

    _self.view.bind('itemAdd', function(date) {
      return _self.addItem(date);
    });

    _self.view.bind('itemRemove', function(id) {
      return _self.removeItem(id);
    });

    _self.view.bind('itemEdit', function(id) {
      return _self.editItem(id);
    });

    _self.view.bind('itemRemoveAll', function() {
      return _self.removeAllItem();
    });

    _self.view.bind('settingsUpdate', function(data) {
      _self.updateSettings(data);
    });

    // _self.view.bind('alert', function() {
    // });

    _self.view.bind('gcal', function() {
      _self.remote.toggle(function() {
        window.dispatchEvent(new Event('gcal'));
      }, function() {
        _self.view.render('gcal', false);
      });
    });
  };

  // export to window
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);