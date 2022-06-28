(function (window) {
  'use strict';

  var Config = function (defaultOpts, storage) {
    var _options = { ...defaultOpts };

    // merge storage settings into default settings
    merge(load());

    /**
     * Merge source into _options, but only for the properties already defined in _options
     * @param {object} source
     */
    function merge(source) {
      for (const key of Object.keys(source)) {
        if (Object.prototype.hasOwnProperty.call(_options, key)) {
          _options[key] = source[key];
        }
      }
    }

    /**
     * Load from storage
     * @returns {object}
     */
    function load() {
      return storage.getItem('config') || {};
    }

    /**
     * Save to storage
     * @returns {boolean} True if save was successful
     */
    function save() {
      storage.setItem('config', _options);
    }

    /**
     * Update the properties of the setting passed by
     * @param {object} data
     */
    this.update = function (data) {
      merge(data);
      save();
    };

    /**
     * Reset the settings to default
     */
    this.reset = function () {
      merge(defaultOpts);
      save();
    };

    /**
     * Get option value
     * @param {string} key
     * @return {number|string}
     */
    this.get = function (key) {
      if (Object.prototype.hasOwnProperty.call(_options, key)) {
        return _options[key];
      }
      return undefined;
    };

    /**
     * Return all options
     * @return {object}
     */
    this.getAll = function () {
      return JSON.parse(JSON.stringify(_options));
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.Config = Config;
})(window);
