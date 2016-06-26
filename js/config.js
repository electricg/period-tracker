(function(window) {
  'use strict';

  var Config = function(name, defaultOpts) {
    const _namespace = name + 'Config';
    var _options = defaultOpts;
    var ls = load();

    for (var key in ls) {
      if (ls.hasOwnProperty(key) && _options.hasOwnProperty(key)) {
        _options[key] = ls[key];
      }
    }

    /**
     * Load from localStorage
     * @returns {object}
     */
    function load() {
      try {
        return JSON.parse(localStorage.getItem(_namespace)) || {};
      } catch (e) {
        console.error(e);
        return {};
      }
    }

    /**
     * Save to localStorage
     * @returns {boolean} True if save was successful
     */
    function save() {
      try {
        localStorage.setItem(_namespace, JSON.stringify(_options));
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }

    /**
     * Update the properties of the setting passed by
     * @param {object} data
     */
    this.update = function(data) {
      for (var key in data) {
        if (data.hasOwnProperty(key) && _options.hasOwnProperty(key)) {
          _options[key] = data[key];
        }
      }
      save();
    };

    /**
     * Get option value
     * @param {string} key
     * @return {number|string}
     */
    this.get = function(key) {
      if (_options.hasOwnProperty(key)) {
        return _options[key];
      }
      return undefined;
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.Config = Config;
})(window);