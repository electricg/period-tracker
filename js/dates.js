/* global moment */
/*
- [x] app.js
- [x] config.js
- [x] controller.js
- [x] helpers.js
- [-] model.js
- [x] offline.js
- [x] settings.js
- [x] storage.js
- [-] template.js
- [x] view.js
*/
'use strict';

(function (window) {
  const NewDate = function (date, parseFormat) {
    const _date = moment(date, parseFormat);

    this.formatDate = function (pattern) {
      return _date.format(pattern);
    };
  };

  const Dates = function () {
    /**
     * Format date by the given pattern
     * @param {string} date Date to format
     * @param {string} format Pattern
     */
    this.formatOnce = function (date, format) {
      return moment(date).format(format);
    };

    /**
     * Difference between two dates
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
