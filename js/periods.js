/* global moment */
/* exported Periods */

var namespace = 'periodTracker';
var datePattern = 'YYYY-MM-DD';
// this regexp is not strict as the date validation will be performed by moment.js
var dateRegExp = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
var averageIntervals = 3;

var Periods = function() {
  var _today = moment().format(datePattern);
  var _list = [];
  var _intervals = [];
  var _average = 0;
  var _next = '';
  var _countdown = 0;

  Object.defineProperty(this, 'list', {
    get: function() {
      return _list;
    }
  });

  Object.defineProperty(this, 'intervals', {
    get: function() {
      return _intervals;
    }
  });

  Object.defineProperty(this, 'average', {
    get: function() {
      return _average;
    }
  });

  Object.defineProperty(this, 'next', {
    get: function() {
      return _next;
    }
  });

  Object.defineProperty(this, 'countdown', {
    get: function() {
      return _countdown;
    }
  });

  /**
   * Sort dates in descending order
   */
  var sortDesc = function() {
    _list.sort();
    _list.reverse();
  };

  /**
   * Check if date is valid
   * @returns {boolean}
   */
  var isValidDate = function(date) {
    // check if the pattern is ok
    if (!dateRegExp.test(date)) {
      return false;
    }
    // check if the date is actually valid
    return moment(date, datePattern).isValid();
  };

  /**
   * Add single occurance
   * @param {string} date - string in YYYY-DD-MM format
   * @returns {number} -1 if not successful, otherwise index number of the added element
   */
  var add = function(date) {
    if (!isValidDate(date)) {
      return -1;
    }
    if (_list.indexOf(date) !== -1) {
      return -1;
    }
    _list.unshift(date);
    sortDesc();
    var index = _list.indexOf(date);
    return index;
  };

  /**
   * Change single occurance
   * @param {string} oldDate - string in YYYY-DD-MM format
   * @param {string} newDate - string in YYYY-DD-MM format
   * @returns {number|object} -1 if not successful, otherwise object with index numbers of the added and removed elements
   */
  var edit = function(oldDate, newDate) {
    if (!isValidDate(oldDate) || !isValidDate(newDate)) {
      return -1;
    }
    var oldIndex = _list.indexOf(oldDate);
    if (_list.indexOf(newDate) !== -1 || oldIndex === -1) {
      return -1;
    }
    _list.splice(oldIndex, 1);
    _list.push(newDate);
    sortDesc();
    var newIndex = _list.indexOf(newDate);
    return {
      o: oldIndex,
      n: newIndex
    };
  };

  /**
   * Remove single occurance
   * @param {string} date - string in YYYY-DD-MM format
   * @returns {number} -1 if not successful, otherwise index number of the removed element
   */
  var remove = function(date) {
    if (!isValidDate(date)) {
      return -1;
    }
    var index = _list.indexOf(date);
    if (index === -1) {
      return -1;
    }
    _list.splice(index, 1);
    return index;
  };

  /**
   * Modify occurances
   * @param {string} how - How to change
   * @param {string} date - string in YYYY-DD-MM format
   * @returns {number} -1 if not successful, otherwise index number of the affected element
   */
  var modify = function(how, date) {
    var mod = -1;
    if (how === 'add') {
      mod = add(date);
    }
    if (how === 'edit') {
      mod = edit(date);
    }
    if (how === 'remove') {
      mod = remove(date);
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
   * Calculate interval in days between occurances
   */
  var calcIntervals = function() {
    _intervals = [];
    for (var i = 1; i < _list.length; i++) {
      _intervals.push( moment.range(_list[i], _list[i - 1]).diff('days') );
    }
  };

  /**
   * Calculate average interval in days between occurances
   */
  var calcAverage = function() {
    var arr = _intervals.slice(0, averageIntervals);
    if (!arr.length) {
      _average = 0;
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
  var calcNext = function() {
    var last = _list[0];
    _next = moment(last).add(_average, 'days').format(datePattern);
  };

  /**
   * Caldulate how many days left until next occurance
   */
  var calcCountdown = function() {
    _countdown = moment.range(_today, _next).diff('days');
  };

  /**
   * Do all calculations
   */
  var calcAll = function() {
    calcIntervals();
    calcAverage();
    calcNext();
    calcCountdown();
  };

  /**
   * Load from localStorage
   * @returns {boolean} True if load was successful
   */
  var load = function() {
    try {
      _list = JSON.parse(localStorage.getItem(namespace)) || [];
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  /**
   * Save to localStorage
   * @returns {boolean} True if save was successful
   */
  var save = function() {
    try {
      localStorage.setItem(namespace, JSON.stringify(_list));
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  /**
   * Init data
   * @returns {array}
   */
  this.init = function() {
    load();
    calcAll();
  };

  /**
   * Add single occurance
   * @param {string} date - string in YYYY-DD-MM format
   * @returns {number} -1 if not successful, otherwise index number of the affected element
   */
  this.add = function(date) {
    return modify('add', date);
  };

  /**
   * Edit single occurance
   * @param {string} date - string in YYYY-DD-MM format
   * @returns {number|object} -1 if not successful, otherwise object with index numbers of the added and removed elements
   */
  this.edit = function(date) {
    return modify('edit', date);
  };

  /**
   * Delete single occurance
   * @param {string} date - string in YYYY-DD-MM format
   * @returns {number} -1 if not successful, otherwise index number of the affected element
   */
  this.remove = function(date) {
    return modify('remove', date);
  };
};