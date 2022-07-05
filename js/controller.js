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
      if (!('FileReader' in window)) {
        throw 'not supported';
      }

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

    const prepareDataForExport = function () {
      const data = JSON.stringify({
        periodTracker: {
          version: version,
          list: _self.model.list,
          config: _self.config.getAll(),
        },
      });
      const now = helpers.todayStr;
      const filename = 'period-tracker_' + now + '.txt';
      const title = 'Period Tracker Backup ' + now;

      return { data, filename, title };
    };

    // TODO clean
    this.exportData = async function () {
      const { data, filename } = prepareDataForExport();

      if (!('showSaveFilePicker' in window)) {
        helpers.oldDownload(filename, data);
        return;
      }

      const options = {
        suggestedName: filename,
        types: [{ accept: { 'text/plain': ['.txt'] } }],
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

    // TODO clean
    this.shareData = function () {
      const { data, filename, title } = prepareDataForExport();
      const file = new File([data], filename, { type: 'text/plain' });
      const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

      // Firefox has a bug where text is not actually shared, and
      // sharing of files is not supported at all, so functionality is
      // totally disabled for it
      // https://github.com/mozilla-mobile/fenix/issues/11946
      if (navigator.canShare && !isFirefox) {
        const sharedObj = {
          title: title,
        };

        if (navigator.canShare({ files: [file] })) {
          sharedObj.files = [file];
        } else if (navigator.canShare({ text: data })) {
          sharedObj.text = data;
        }

        navigator.share(sharedObj).catch((e) => {
          // if the user doesn't share the file, swallow the relative browser error
        });
      } else {
        _self.view.render(
          'error',
          'This functionality is not supported in your browser/os/device'
        );
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
