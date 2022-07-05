/* global moment */
(function (window) {
  'use strict';

  // this regexp is not strict as the date validation will be performed by moment.js
  const dateRegExp = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
  const averageIntervals = 3;

  var Model = function (config, storage) {
    var _self = this;
    _self.config = config;

    var todayStr = helpers.todayStr;
    var _list = [];
    var _quicklist = [];
    var _intervals = [];
    var _average = 0;
    var _next = '';
    var _countdown = 0;
    var _counter = 0;

    Object.defineProperty(this, 'list', {
      get: function () {
        return _list;
      },
    });

    Object.defineProperty(this, 'quicklist', {
      get: function () {
        return _quicklist;
      },
    });

    Object.defineProperty(this, 'intervals', {
      get: function () {
        return _intervals;
      },
    });

    Object.defineProperty(this, 'average', {
      get: function () {
        return _average;
      },
    });

    Object.defineProperty(this, 'next', {
      get: function () {
        return _next;
      },
    });

    Object.defineProperty(this, 'countdown', {
      get: function () {
        return _countdown;
      },
    });

    Object.defineProperty(this, 'counter', {
      get: function () {
        return _counter;
      },
    });

    /**
     * Sort dates in descending order
     */
    var sortDesc = function () {
      _list.sort(function (a, b) {
        if (a.date < b.date) {
          return 1;
        }
        if (a.date > b.date) {
          return -1;
        }
        return 0;
      });
    };

    /**
     * Check if date is valid
     * @returns {boolean}
     */
    var isValidDate = function (date) {
      // check if the pattern is ok
      if (!dateRegExp.test(date)) {
        return false;
      }
      // check if the date is actually valid
      return moment(date, helpers.datePattern).isValid();
    };

    /**
     * Find occurance by id
     * @param {string} id - id of the occurance to find
     * @returns {number} -1 if not found, otherwise index number of the element
     */
    var findById = function (id) {
      var index = -1;
      for (var i = 0; i < _list.length; i++) {
        if (id === _list[i].id) {
          index = i;
          break;
        }
      }
      return index;
    };

    /**
     * Find occurance by date
     * @param {string} date - string in YYYY-DD-MM format
     * @returns {number} -1 if not found, otherwise index number of the element
     */
    var findByDate = function (date) {
      var index = -1;
      for (var i = 0; i < _list.length; i++) {
        if (date === _list[i].date) {
          index = i;
          break;
        }
      }
      return index;
    };

    /**
     * Add single occurance
     * @param {string} date - string in YYYY-DD-MM format
     * @returns {number} -1 if not successful, otherwise the added element
     */
    var add = function (date) {
      if (!isValidDate(date)) {
        return -1;
      }
      if (findByDate(date) !== -1) {
        return -1;
      }
      var now = moment();
      var id = now.valueOf() + '';
      var newItem = {
        id: id,
        date: date,
        created: now.format(),
        updated: now.format(),
      };
      _list.unshift(newItem);
      sortDesc();
      return newItem;
    };

    /**
     * Change single occurance
     * @param {string} id - id of the occurance to edit
     * @param {string} date - string in YYYY-DD-MM format
     * @returns {number|object} -1 if not successful, otherwise the updated element
     */
    var edit = function (id, date) {
      if (!isValidDate(date)) {
        return -1;
      }
      var indexById = findById(id);
      if (indexById === -1) {
        return -1;
      }
      if (findByDate(date) !== -1) {
        return -1;
      }
      var el = _list[indexById];
      el.date = date;
      el.updated = moment().format();
      sortDesc();
      return el;
    };

    /**
     * Remove single occurance
     * @param {string} id - id of the occurance to remove
     * @returns {number|object} -1 if not successful, otherwise the removed element
     */
    var remove = function (id) {
      var index = findById(id);
      if (index === -1) {
        return -1;
      }
      var removed = _list.splice(index, 1);
      return removed[0];
    };

    /**
     * Remove all occurances
     * @returns {number|object} -1 if data was already empty, otherwise the removed elements
     */
    var clear = function () {
      var removed = -1;
      if (_list.length > 0) {
        removed = _list.splice(0);
      }
      return removed;
    };

    /**
     * Replace all occurances with passed list
     * @param {array} newList - new list of occurances
     * @returns {array}
     */
    var update = function (newList) {
      _list = [...newList];
      return _list;
    };

    /**
     * Modify occurances
     * @param {string} how - How to change
     * @param {string} id - id of the occurance
     * @param {string} date - string in YYYY-DD-MM format
     * @param {array} list - new list
     * @returns {number|object} -1 if not successful, otherwise the affected elements
     */
    var modify = function (how, id, date, list) {
      var mod = -1;
      if (how === 'add') {
        mod = add(date);
      }
      if (how === 'edit') {
        mod = edit(id, date);
      }
      if (how === 'remove') {
        mod = remove(id);
      }
      if (how === 'clear') {
        mod = clear();
      }
      if (how === 'update') {
        mod = update(list);
      }
      if (mod !== -1) {
        calcAll();
        if (save()) {
          return mod;
        }
        return -1;
      }
      return -1;
    };

    /**
     * Create a simple array of only dates
     */
    var calcQuicklist = function () {
      _quicklist = [];
      _list.forEach(function (item) {
        _quicklist.push(item.date);
      });
    };

    /**
     * Calculate interval in days between occurances
     */
    var calcIntervals = function () {
      _intervals = [];
      for (var i = 1; i < _list.length; i++) {
        _intervals.push(moment(_list[i - 1].date).diff(_list[i].date, 'days'));
      }
    };

    /**
     * Calculate average interval in days between occurances
     */
    var calcAverage = function () {
      var arr = _intervals.slice(0, averageIntervals);
      if (!arr.length) {
        _average = _self.config.get('cycleLength');
        return;
      }
      var sum = 0;
      for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
      }
      _average = Math.round(sum / arr.length);
    };

    /**
     * Calculate next occurance
     */
    var calcNext = function () {
      var last = todayStr;
      var lastItem = _list[0];
      if (lastItem) {
        last = lastItem.date;
      }
      if (_list.length) {
        _next = moment(last).add(_average, 'days').format(helpers.datePattern);
      } else {
        _next = '';
      }
    };

    /**
     * Caldulate how many days left until next occurance
     */
    var calcCountdown = function () {
      if (_next) {
        _countdown = moment(_next).diff(todayStr, 'days');
        _counter = _average - _countdown + 1;
      } else {
        _countdown = 0;
        _counter = 0;
      }
    };

    /**
     * Do all calculations
     */
    var calcAll = function () {
      calcQuicklist();
      calcIntervals();
      calcAverage();
      calcNext();
      calcCountdown();
    };

    /**
     * Load from storage
     * @returns {boolean} True if load was successful
     */
    var load = function () {
      _list = storage.getItem('') || [];
    };

    /**
     * Save to storage
     * @returns {boolean} True if save was successful
     */
    var save = function () {
      return storage.setItem('', _list);
    };

    /**
     * Init data
     * @returns {array}
     */
    this.init = function () {
      load();
      calcAll();
    };

    /**
     * Recalc data
     */
    this.calc = function () {
      calcAll();
    };

    /**
     * Add single occurance
     * @param {string} date - string in YYYY-DD-MM format
     * @returns {number|object} -1 if not successful, otherwise the affected elements
     */
    this.add = function (date) {
      return modify('add', null, date);
    };

    /**
     * Edit single occurance
     * @param {string} id - id of the occurance to edit
     * @param {string} date - string in YYYY-DD-MM format
     * @returns {number|object} -1 if not successful, otherwise the affected elements
     */
    this.edit = function (id, date) {
      return modify('edit', id, date);
    };

    /**
     * Delete single occurance
     * @param {string} id - id of the occurance to remove
     * @returns {number|object} -1 if not successful, otherwise the affected elements
     */
    this.remove = function (id) {
      return modify('remove', id);
    };

    /**
     * Delete all occurances
     * @returns {number|object} -1 if not successful, otherwise the affected elements
     */
    this.clear = function () {
      return modify('clear');
    };

    /**
     * Replace list
     * @param {array} list
     * @returns {array} -1 if not successful, otherwise the new list
     */
    this.update = function (list) {
      return modify('update', null, null, list);
    };

    this.init();
  };

  // export to window
  window.app = window.app || {};
  window.app.Model = Model;
})(window);
