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
    _self.remote = {};
    _self.remoteData = {};

    // in theory we could have more than one remote backend service to sync the data with, all independent from each other
    // ['add', 'edit', 'remove', 'clear'].forEach(function(action) {
    //   _self.remote[action] = function() {
    //     for (var r in remote) {
    //       if (remote.hasOwnProperty(r)) {
    //         remote[r][action].apply(this, arguments);
    //       }
    //     }
    //   };
    // });
    for (var r in remote) {
      if (remote.hasOwnProperty(r)) {
        _self.remoteData[r] = {};
      }
    }

    _self.remote.add = function(data, callback) {
      for (var r in remote) {
        if (remote.hasOwnProperty(r)) {
          remote[r].add(data, function(result) {
            _self.remoteData[r][data.id] = result.id;
            callback = callback || function() {};
            callback(result);
          });
        }
      }
    };

    _self.remote.edit = function(id, data, callback) {
      var _id;
      for (var r in remote) {
        if (remote.hasOwnProperty(r)) {
          _id = _self.remoteData[r][id];
          remote[r].edit(_id, data, function(result) {
            callback = callback || function() {};
            callback(result);
          });
        }
      }
    };

    _self.remote.remove = function(id, callback) {
      var _id;
      for (var r in remote) {
        if (remote.hasOwnProperty(r)) {
          _id = _self.remoteData[r][id];
          remote[r].remove(_id, function(result) {
            delete _self.remoteData[r][id];
            callback = callback || function() {};
            callback(result);
          });
        }
      }
    };

    _self.remote.clear = function(callback) {
      for (var r in remote) {
        if (remote.hasOwnProperty(r)) {
          remote[r].clear(function(result) {
            _self.remoteData[r] = {};
            callback = callback || function() {};
            callback(result);
          });
        }
      }
    };

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

    _self.view.bind('alert', function() {
      
    });
  };

  // export to window
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);