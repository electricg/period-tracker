(function (window) {
  'use strict';

  /**
   * Take a model and view and acts as the controller between them
   * @param {object} model The model instance
   * @param {object} view The view instance
   */
  var Controller = function (model, view) {
    var _self = this;
    _self.model = model;
    _self.view = view;
    _self.config = _self.view.config;

    /**
     * Show the selected section
     * @param {string} locationHash
     */
    this.setSection = function (locationHash) {
      var args = locationHash.split('/');
      args.shift();
      var section = args.shift();
      _self.view.render('section', _self.model, section, args);
    };

    /**
     * Insert data into the views
     */
    this.setData = function () {
      _self.view.render('chrome');
      _self.view.render('home', _self.model);
      _self.view.render('log', _self.model);
      _self.view.render('settings');
    };

    this.addItem = function (date) {
      var res = _self.model.add(date);
      if (res !== -1) {
        _self.setData();
      } else {
        _self.view.render('error', 'Error adding entry');
      }
      return res;
    };

    this.removeItem = function (id) {
      var res = _self.model.remove(id);
      if (res !== -1) {
        _self.setData();
      } else {
        _self.view.render('error', 'Error removing entry');
      }
      return res;
    };

    this.editItem = function (id, date) {
      var res = _self.model.edit(id, date);
      if (res !== -1) {
        _self.setData();
      } else {
        _self.view.render('error', 'Error editing entry');
      }
      return res;
    };

    this.removeAllItem = function () {
      _self.config.reset();
      _self.model.clear();
      _self.setData();
      _self.view.render('success', 'Data deleted successfully');
    };

    this.updateSettings = function (data) {
      _self.config.update(data);
      _self.model.calc();
      _self.setData();
    };

    // TODO clean
    this.importData = function (file) {
      const reader = new FileReader();
      if (file) {
        reader.readAsText(file);
      }
      reader.addEventListener(
        'load',
        function () {
          const data = JSON.parse(reader.result);

          _self.model.update(data.periodTracker.list);
          _self.config.update(data.periodTracker.config);
          // update the ui
          _self.setData();
          _self.view.render('success', 'Data imported successfully');
        },
        false
      );
    };

    // TODO clean
    this.exportData = async function () {
      const data = JSON.stringify({
        periodTracker: {
          version: version,
          list: _self.model.list,
          config: _self.config.getAll(),
        },
      });
      const now = moment().format('YYYY-MM-DD');
      const options = {
        suggestedName: 'period-tracker_' + now + '.json',
        types: [{ accept: { 'text/plain': ['.json'] } }],
      };

      try {
        const fileHandle = await window.showSaveFilePicker(options);
        const writable = await fileHandle.createWritable();
        await writable.write(data);
        await writable.close();
      } catch (e) {
        // if the user doesn't save the file, swallow the relative browser error
      }
    };

    _self.view.bind('itemAdd', function (date) {
      return _self.addItem(date);
    });

    _self.view.bind('itemRemove', function (id) {
      return _self.removeItem(id);
    });

    _self.view.bind('itemEdit', function (id) {
      return _self.editItem(id);
    });

    _self.view.bind('importData', function (file) {
      return _self.importData(file);
    });

    _self.view.bind('exportData', function () {
      return _self.exportData();
    });

    _self.view.bind('itemRemoveAll', function () {
      return _self.removeAllItem();
    });

    _self.view.bind('settingsUpdate', function (data) {
      _self.updateSettings(data);
    });

    // _self.view.bind('alert', function() {
    // });
  };

  // export to window
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);
