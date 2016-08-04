(function(window) {
  'use strict';

  var Config = function(name, defaultOpts) {
    const _namespace = name + 'Config';
    var _options = defaultOpts;

    // merge localStorage settings into default settings
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
      merge(data);
      save();
    };

    /**
     * Get option value
     * @param {string} key
     * @return {number|string}
     */
    this.get = function(key) {
      if (Object.prototype.hasOwnProperty.call(_options, key)) {
        return _options[key];
      }
      return undefined;
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.Config = Config;
})(window);