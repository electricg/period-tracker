/* global moment, dates, helpers */
(function (window) {
  'use strict';

  var Template = function (config) {
    var _self = this;
    _self.config = config;

    var _week = dates.weekdaysShort();

    /**
     * @param {object} data
     * @param {number} startDayOfWeek - 0 Sunday, 1 Monday, 6 Saturday
     * @param {number} monthN - month number
     * @param {number} yearN - year number
     */
    var calendarGet = function (data, startDayOfWeek, monthN, yearN) {
      var currentMonthN = helpers.today.formatDate('M');
      var currentYearN = helpers.today.formatDate('YYYY');

      monthN = monthN || currentMonthN;
      yearN = yearN || currentYearN;

      var thisMonth = moment(yearN + '-' + monthN, 'YYYY-M'); // moment
      var weekdayFirstDayThisMonth = thisMonth.format('d'); // moment
      var daysInThisMonth = thisMonth.daysInMonth(); // moment
      var lastDayThisMonth = moment(
        // moment
        yearN + '-' + monthN + '-' + daysInThisMonth,
        'YYYY-M-D'
      );
      var weekdayLastDayThisMonth = lastDayThisMonth.format('d'); // moment
      var monthTitle = thisMonth.format('MMMM YYYY'); // moment

      // rearrange weekday names starting from our own first day of the week
      var weekTitle = _week.slice(0);
      var leftoverWeek = weekTitle.splice(0, startDayOfWeek);
      weekTitle = weekTitle.concat(leftoverWeek);

      // previous and next month data for nav links
      var nextMonth = thisMonth.clone().add(1, 'months'); // moment
      var prevMonth = thisMonth.clone().add(-1, 'months'); // moment
      var nextObj = {
        monthN: nextMonth.format('M'), // moment
        yearN: nextMonth.format('YYYY'), // moment
        title: nextMonth.format('MMMM YYYY'), // moment
      };
      var prevObj = {
        monthN: prevMonth.format('M'), // moment
        yearN: prevMonth.format('YYYY'), // moment
        title: prevMonth.format('MMMM YYYY'), // moment
      };

      // previous and next year data for nav links
      var nextYear = thisMonth.clone().add(1, 'years'); // moment
      var prevYear = thisMonth.clone().add(-1, 'years'); // moment
      var nextYearObj = {
        monthN: nextYear.format('M'), // moment
        yearN: nextYear.format('YYYY'), // moment
        title: nextYear.format('MMMM YYYY'), // moment
      };
      var prevYearObj = {
        monthN: prevYear.format('M'), // moment
        yearN: prevYear.format('YYYY'), // moment
        title: prevYear.format('MMMM YYYY'), // moment
      };

      // current month and year data for today link
      var currentObj = {
        monthN: currentMonthN,
        yearN: currentYearN,
        title: helpers.today.formatDate('MMMM YYYY'),
      };

      var days = [];

      // before
      var daysInPrevMonth = prevMonth.daysInMonth(); // moment
      var diffStart = weekdayFirstDayThisMonth - startDayOfWeek;
      if (diffStart < 0) {
        diffStart = 7 + diffStart;
      }
      diffStart = daysInPrevMonth - diffStart + 1;
      for (var i1 = diffStart; i1 <= daysInPrevMonth; i1++) {
        days.push({
          date:
            prevObj.yearN +
            '-' +
            helpers.z(prevObj.monthN) +
            '-' +
            helpers.z(i1),
          n: i1,
          c: '',
          k: ['calendar__day--another-month'],
        });
      }
      // during
      for (var i2 = 1; i2 <= daysInThisMonth; i2++) {
        days.push({
          date: yearN + '-' + helpers.z(monthN) + '-' + helpers.z(i2),
          n: i2,
          c: '',
          k: [],
        });
      }
      // after
      var diffEnd = startDayOfWeek - 1 - weekdayLastDayThisMonth;
      if (diffEnd < 0) {
        diffEnd = 7 + diffEnd;
      }
      for (var i3 = 1; i3 <= diffEnd; i3++) {
        days.push({
          date:
            nextObj.yearN +
            '-' +
            helpers.z(nextObj.monthN) +
            '-' +
            helpers.z(i3),
          n: i3,
          c: '',
          k: ['calendar__day--another-month'],
        });
      }

      // maximum date that is less than or equal the first day of the visible month
      // TODO what is this?
      var floor;
      var firstDay = days[0].date;
      var firstDayDate = moment(firstDay); // moment
      for (var i5 = 0; i5 < data.quicklist.length; i5++) {
        if (data.quicklist[i5] <= firstDay) {
          floor = data.quicklist[i5]; // eslint-disable-line no-unused-vars
          break;
        }
      }

      // minimum date that is greater than the last day of the visible month
      var ceiling;
      var lastDay = days[days.length - 1].date;
      var lastDayDate = moment(lastDay); // moment
      for (var i6 = i5 - 1; i6 >= 0; i6--) {
        if (data.quicklist[i6] > lastDay) {
          ceiling = data.quicklist[i6];
          break;
        }
      }

      // list of dates to show in the visible month
      var sliceOfDates = data.quicklist.slice(i6 + 1, i5 + 1);

      // if we have the maximum but not the minimum date, it means we are in the future, so calculate the next events
      if (!ceiling && data.quicklist.length) {
        var lastEventDate = moment(sliceOfDates[0]); // moment
        var daysLastSinceLastEvent =
          lastDayDate.diff(lastEventDate, 'days') + 1; // moment
        if (daysLastSinceLastEvent > data.average) {
          var daysFirstSinceLastEvent =
            firstDayDate.diff(lastEventDate, 'days') + 1; // moment
          var daysFirstDiff = daysFirstSinceLastEvent % data.average;
          var n = firstDayDate.clone().subtract(daysFirstDiff - 1, 'days'); // moment
          sliceOfDates = [n.format(helpers.datePattern)]; // moment
          var daysEndDiff = daysFirstDiff + days.length;
          var quotient = Math.floor(daysEndDiff / data.average);
          for (var q = 0; q <= quotient; q++) {
            n.add(data.average, 'days'); // moment
            sliceOfDates.unshift(n.format(helpers.datePattern)); // moment
          }
        }
      }

      var firstEventDate = moment(sliceOfDates[sliceOfDates.length - 1]); // moment
      var counter = firstDayDate.diff(firstEventDate, 'days') + 1; // moment

      var todayStr = helpers.todayStr;
      days.forEach(function (item) {
        if (sliceOfDates.indexOf(item.date) !== -1) {
          counter = 1;
        }
        if (counter) {
          if (counter > 0) {
            item.c = counter;
          }
          counter++;
        }
        if (item.date === todayStr) {
          item.k.push('calendar__day--today');
        } else if (item.date > todayStr) {
          item.k.push('calendar__day--future');
        }
      });

      return {
        days: days,
        week: weekTitle,
        title: monthTitle,
        next: nextObj,
        prev: prevObj,
        nextYear: nextYearObj,
        prevYear: prevYearObj,
        current: currentObj,
      };
    };

    this.calendar = function (data, monthN, yearN) {
      var _startDayOfWeek = _self.config.get('startDayOfWeek');
      var _showExtendedMonth = _self.config.get('showExtendedMonth');
      var _periodLength = _self.config.get('periodLength');
      var cal = calendarGet(data, _startDayOfWeek, monthN, yearN);

      var rowsTitle = function (prev, day) {
        return (
          prev +
          `
          <th class="calendar__weekday">${day}</th>
        `
        );
      };

      var rowDays = function (prev, item) {
        if (item.c >= 1 && item.c <= _periodLength) {
          item.k.push('calendar__day--selected');
        }
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
        (monthN === undefined && yearN === undefined) ||
        (monthN === cal.current.monthN && yearN === cal.current.yearN)
          ? ''
          : `
        <a href="#/calendar/${cal.current.yearN}/${cal.current.monthN}" class="calendar__nav__link" title="${cal.current.title}" aria-label="This month, ${cal.current.title}">
          <svg class="icon calendar__nav__icon" focusable="false" aria-hidden="true">
            <use href="#icon-today"></use>
          </svg>
        </a>
      `;

      var table = `
        <table class="calendar ${showExtendedMonth}">
          <thead>
            <tr>
              <th colspan="7">
                <nav class="calendar__nav">
                  <div>
                    <a href="#/calendar/${cal.prev.yearN}/${
        cal.prev.monthN
      }" class="calendar__nav__link" title="${
        cal.prev.title
      }" aria-label="Previous month, ${cal.prev.title}">
                      <svg class="icon calendar__nav__icon" focusable="false" aria-hidden="true">
                        <use href="#icon-prev"></use>
                      </svg>
                    </a>
                    <a href="#/calendar/${cal.next.yearN}/${
        cal.next.monthN
      }" class="calendar__nav__link" title="${
        cal.next.title
      }" aria-label="Next month, ${cal.next.title}">
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
                    <a href="#/calendar/${cal.prevYear.yearN}/${
        cal.prevYear.monthN
      }" class="calendar__nav__link" title="${
        cal.prevYear.title
      }" aria-label="Previous year, ${cal.prevYear.title}">
                      <svg class="icon calendar__nav__icon" focusable="false" aria-hidden="true">
                        <use href="#icon-up"></use>
                      </svg>
                    </a>
                    <a href="#/calendar/${cal.nextYear.yearN}/${
        cal.nextYear.monthN
      }" class="calendar__nav__link" title="${
        cal.nextYear.title
      }" aria-label="Next year, ${cal.nextYear.title}">
                      <svg class="icon calendar__nav__icon" focusable="false" aria-hidden="true">
                        <use href="#icon-down"></use>
                      </svg>
                    </a>
                  </div>
                </nav>
              </th>
            </tr>
            <tr>
              ${cal.week.reduce(rowsTitle, '')}
            </tr>
          </thead>
          <tbody>
            ${rowsContent()}
          </tbody>
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
