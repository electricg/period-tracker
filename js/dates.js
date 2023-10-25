/* global moment */
'use strict';

(function (window) {
  const NewDate = function (...args) {
    const _date = moment(...args);

    Object.defineProperty(this, 'isANewDateObject', {
      get: function () {
        return true;
      },
    });

    /**
     * Format date by the given pattern
     * @param {string} format Pattern to parse the date
     * @returns {string} Formatted date
     */
    this.formatDate = function (format) {
      return _date.format(format);
    };

    /**
     * Return numeric value of the unit of the date
     * @param {('year'|'month'|'date'|'day')} unit
     * @returns {number}
     */
    this.getDate = function (unit) {
      let value = _date.get(unit);
      if (unit === 'month') {
        value += 1;
      }
      return value;
    };

    /**
     * Mutate the original date by adding time
     * @param {number} number
     * @param {string} string
     * @returns Date object
     */
    this.addDate = function (...args) {
      _date.add(...args);
      return this;
    };

    /**
     * Get the number of days in the month
     * @returns {number} Number of days
     */
    this.daysInMonthDate = function () {
      return _date.daysInMonth();
    };

    /**
     * Clone a date object, since all dates are mutable
     * @param  {...any} args
     * @returns {object}
     */
    this.cloneDate = function (...args) {
      var copy = _date.clone(...args);
      return new NewDate(copy);
    };

    /**
     * Mutate the original date by subtracting time
     * @param  {number} number
     * @param  {string} string
     * @returns Date object
     */
    this.subtractDate = function (...args) {
      _date.subtract(...args);
      return this;
    };

    /**
     * Difference between two dates, (this - arg)
     * @param {string} dateB Second date
     * @param {string} unit Unit of measurement of the difference
     * @returns {number} Difference
     */
    this.diffDate = function (dateB, ...args) {
      let _dateB;
      if (typeof dateB === 'object' && dateB.isANewDateObject) {
        _dateB = dateB.formatDate();
      } else {
        _dateB = dateB;
      }
      return _date.diff(_dateB, ...args);
    };
  };

  const Dates = function () {
    /**
     * Format date by the given pattern
     * @param {string} date Date to format
     * @param {string} format Pattern
     * @returns {string} Formatted date
     */
    this.formatOnce = function (date, format) {
      return moment(date).format(format);
    };

    /**
     * Difference between two dates, (A - B)
     * @param {string} dateA First date
     * @param {string} dateB Second date
     * @param {string} unit Unit of measurement of the difference
     * @returns {number} Difference
     */
    this.diffOnce = function (dateA, dateB, unit) {
      return moment(dateA).diff(dateB, unit);
    };

    /**
     * Check if date is valid
     * @param {string} date Date to check
     * @param {string} format Pattern to parse the date
     * @returns {boolean} True if valid
     */
    this.isValid = function (date, format) {
      return moment(date, format).isValid();
    };

    /**
     * Returns the list of weekdays (3 letters each)
     * @returns {Array<string>} Array of strings
     */
    this.weekdaysShort = function () {
      return moment.weekdaysShort();
    };

    this.newDate = function (date, format) {
      return new NewDate(date, format);
    };
  };

  window.dates = new Dates();
})(window);
