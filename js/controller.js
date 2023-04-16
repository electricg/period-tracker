/* global helpers, NAMESPACE, VERSION, FILE */
'use strict';

(function (window) {
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

    this.importData = async function (file) {
      let data = {};

      try {
        const res = await helpers.readFromInputFile(file);
        data = JSON.parse(res)[NAMESPACE];
      } catch (e) {
        _self.view.render('error', e);
        return;
      }
      // TODO should check that the data imported is correct
      _self.model.update(data.list);
      _self.config.update(data.config);

      // update the ui
      _self.setData();
      _self.view.render('success', 'Data imported successfully');
    };

    const prepareDataForExport = function () {
      const data = JSON.stringify({
        [NAMESPACE]: {
          version: VERSION,
          list: _self.model.list,
          config: _self.config.getAll(),
        },
      });
      const now = helpers.todayStr;
      const filename = FILE.name.replace('${now}', now);
      const title = FILE.title.replace('${now}', now);

      return { data, filename, title };
    };

    this.exportData = async function () {
      const { data, filename } = prepareDataForExport();
      await helpers.writeToFile(filename, data);
    };

    this.shareData = function () {
      const { data, filename, title } = prepareDataForExport();
      try {
        helpers.shareTo(filename, data, title);
      } catch (e) {
        _self.view.render('error', e);
      }
    };

    _self.view.bind('itemAdd', function (date) {
      return _self.addItem(date);
    });

    _self.view.bind('itemRemove', function (id) {
      return _self.removeItem(id);
    });

    _self.view.bind('itemEdit', function (id, date) {
      return _self.editItem(id, date);
    });

    _self.view.bind('showItemEdit', function (id) {
      return _self.model.getById(id);
    });

    _self.view.bind('importData', function (file) {
      return _self.importData(file);
    });

    _self.view.bind('exportData', function () {
      return _self.exportData();
    });

    _self.view.bind('shareData', function () {
      return _self.shareData();
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
