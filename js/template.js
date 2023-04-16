/* global dates, calendar */
'use strict';

(function (window) {
  var Template = function (config) {
    var _self = this;
    _self.config = config;

    this.calendar = function (data, monthN, yearN) {
      var _startDayOfWeek = _self.config.get('startDayOfWeek');
      var _showExtendedMonth = _self.config.get('showExtendedMonth');
      var _periodLength = _self.config.get('periodLength');
      var cal = calendar.calcCalendarData(
        data,
        _startDayOfWeek,
        _periodLength,
        monthN,
        yearN
      );

      var rowsTitle = function (prev, day) {
        return (
          prev +
          `
          <th class="calendar__weekday">${day}</th>
        `
        );
      };

      var rowDays = function (prev, item) {
        return (
          prev +
          `
          <td data-counter="${item.c}" class="calendar__day ${item.k.join(
            ' '
          )}">${item.n}</td>
        `
        );
      };

      var rowsContent = function () {
        var arr = [];
        for (var i = 0; i < cal.days.length; i += 7) {
          arr.push(cal.days.slice(i, i + 7));
        }
        var table = arr.reduce(function (prev, item) {
          return (
            prev +
            `
            <tr>
              ${item.reduce(rowDays, '')}
            </tr>
            `
          );
        }, '');
        return table;
      };

      var showExtendedMonth = _showExtendedMonth ? 'calendar--extended' : '';

      var currentMonthLink =
        monthN === cal.current.monthN && yearN === cal.current.yearN
          ? ''
          : `
        <a href="#/calendar" class="calendar__nav__link" title="${cal.current.title}" aria-label="This month, ${cal.current.title}">
          <svg class="icon calendar__nav__icon" focusable="false" aria-hidden="true">
            <use href="#icon-today"></use>
          </svg>
        </a>
      `;

      var nav = `
        <tr>
          <th colspan="7">
            <nav class="calendar__nav">
              <div>
                <a href="#/calendar/${cal.prev.yearN}/${cal.prev.monthN}" class="calendar__nav__link" title="${cal.prev.title}" aria-label="Previous month, ${cal.prev.title}">
                  <svg class="icon calendar__nav__icon" focusable="false" aria-hidden="true">
                    <use href="#icon-prev"></use>
                  </svg>
                </a>
                <a href="#/calendar/${cal.next.yearN}/${cal.next.monthN}" class="calendar__nav__link" title="${cal.next.title}" aria-label="Next month, ${cal.next.title}">
                  <svg class="icon calendar__nav__icon" focusable="false" aria-hidden="true">
                    <use href="#icon-next"></use>
                  </svg>
                </a>
              </div>
            
              <div class="calendar__nav__middle">
                <span>${cal.title}</span>
                ${currentMonthLink}
              </div>

              <div>
                <a href="#/calendar/${cal.prevYear.yearN}/${cal.prevYear.monthN}" class="calendar__nav__link" title="${cal.prevYear.title}" aria-label="Previous year, ${cal.prevYear.title}">
                  <svg class="icon calendar__nav__icon" focusable="false" aria-hidden="true">
                    <use href="#icon-up"></use>
                  </svg>
                </a>
                <a href="#/calendar/${cal.nextYear.yearN}/${cal.nextYear.monthN}" class="calendar__nav__link" title="${cal.nextYear.title}" aria-label="Next year, ${cal.nextYear.title}">
                  <svg class="icon calendar__nav__icon" focusable="false" aria-hidden="true">
                    <use href="#icon-down"></use>
                  </svg>
                </a>
              </div>
            </nav>
          </th>
        </tr>
      `;

      var week = `
      <tr>
        ${cal.week.reduce(rowsTitle, '')}
      </tr>
      `;

      var table = `
        <table class="calendar ${showExtendedMonth}">
          <thead>
            ${nav}
            ${week}
          </thead>
          <tbody>
            ${rowsContent()}
          </tbody>
          <tfoot>
            ${week}
            ${nav}
          </tfoot>
        </table>
      `;

      return table;
    };

    this.log = function (data) {
      var rows = function (prev, item, index) {
        var s = dates.formatOnce(item.date, 'MMM D, YYYY');
        var interval =
          typeof data.intervals[index] !== 'undefined'
            ? data.intervals[index]
            : '';
        return (
          prev +
          `
          <tr>
            <td class="log-list__info log-list__info--date"><time datetime="${item.date}">${s}</time></td>
            <td class="log-list__info log-list__info--interval">${interval}</td>
            <td class="log-list__info log-list__info--edit">
              <button data-id="${item.id}" class="log-list__button js-edit" title="Edit" aria-label="Edit">
                <svg class="icon log-list__button__icon" focusable="false" aria-hidden="true">
                  <use href="#icon-edit"></use>
                </svg>
              </button>
            </td>
            <td class="log-list__info log-list__info--remove">
              <button data-id="${item.id}" data-date="${s}" class="log-list__button js-remove" title="Remove" aria-label="Remove">
                <svg class="icon log-list__button__icon" focusable="false" aria-hidden="true">
                  <use href="#icon-delete"></use>
                </svg>
              </button>
            </td>
          </tr>
        `
        );
      };

      var table = `
        ${data.list.reduce(rows, '')}
      `;

      return table;
    };

    this.alert = function (type, msg) {
      var code = `
        <div class="alert alert--${type}">
          <span>${msg}</span>
          <button class="alert__close js-close" title="Close" aria-label="Close" onClick="this.parentNode.remove()">
            <svg class="icon alert__close__icon" focusable="false" aria-hidden="true">
              <use href="#icon-cancel-circle"></use>
            </svg>
          </button>
        </div>
      `;

      return code;
    };
  };

  window.app = window.app || {};
  window.app.Template = Template;
})(window);
