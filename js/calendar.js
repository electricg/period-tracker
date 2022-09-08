/* global dates, helpers */
(function (window) {
  'use strict';

  const Calendar = function () {
    /**
     * @param {number} startDayOfWeek - 0 Sunday, 1 Monday, 6 Saturday
     * @param {number|string} selectedMonthN - Selected month number, 1 or 2 digits no zero leading
     * @param {number|string} selectedYearN - Selected year number, 4 digits
     */
    this._calendarChrome = (startDayOfWeek, selectedMonthN, selectedYearN) => {
      const week = dates.weekdaysShort();

      // rearrange weekday names starting from our own first day of the week
      let weekTitle = week.slice(0);
      const leftoverWeek = weekTitle.splice(0, startDayOfWeek);
      weekTitle = weekTitle.concat(leftoverWeek);

      const selectedMonthYear = dates.newDate(
        selectedYearN + '-' + selectedMonthN,
        'YYYY-M'
      );
      const title = selectedMonthYear.formatDate('MMMM YYYY');

      // previous and next month data for nav links
      const nextMonth = selectedMonthYear.cloneDate().addDate(1, 'months');
      const prevMonth = selectedMonthYear.cloneDate().addDate(-1, 'months');
      const nextMonthObj = {
        monthN: nextMonth.formatDate('M'),
        yearN: nextMonth.formatDate('YYYY'),
        title: nextMonth.formatDate('MMMM YYYY'),
      };
      const prevMonthObj = {
        daysInMonth: prevMonth.daysInMonthDate(),
        monthN: prevMonth.formatDate('M'),
        yearN: prevMonth.formatDate('YYYY'),
        title: prevMonth.formatDate('MMMM YYYY'),
      };

      // previous and next year data for nav links
      const nextYear = selectedMonthYear.cloneDate().addDate(1, 'years');
      const prevYear = selectedMonthYear.cloneDate().addDate(-1, 'years');
      const nextYearObj = {
        monthN: nextYear.formatDate('M'),
        yearN: nextYear.formatDate('YYYY'),
        title: nextYear.formatDate('MMMM YYYY'),
      };
      const prevYearObj = {
        monthN: prevYear.formatDate('M'),
        yearN: prevYear.formatDate('YYYY'),
        title: prevYear.formatDate('MMMM YYYY'),
      };

      // current month and year data for today link
      const todayObj = {
        monthN: helpers.today.formatDate('M'),
        yearN: helpers.today.formatDate('YYYY'),
        title: helpers.today.formatDate('MMMM YYYY'),
      };

      return {
        weekTitle,
        nextMonthObj,
        prevMonthObj,
        nextYearObj,
        prevYearObj,
        todayObj,
        title,
      };
    };

    this.calcCalendarData = function (
      data,
      startDayOfWeek,
      periodLength,
      selectedMonthN,
      selectedYearN
    ) {
      var calendarDays = function (
        startDayOfWeek,
        selectedMonthN,
        selectedYearN,
        prevMonthObj,
        nextMonthObj
      ) {
        var days = [];

        var thisMonth = dates.newDate(
          selectedYearN + '-' + selectedMonthN,
          'YYYY-M'
        );
        var weekdayFirstDayThisMonth = thisMonth.formatDate('d');
        var daysInThisMonth = thisMonth.daysInMonthDate();
        var lastDayThisMonth = dates.newDate(
          selectedYearN + '-' + selectedMonthN + '-' + daysInThisMonth,
          'YYYY-M-D'
        );
        var weekdayLastDayThisMonth = lastDayThisMonth.formatDate('d');

        // before
        var diffStart = weekdayFirstDayThisMonth - startDayOfWeek;
        if (diffStart < 0) {
          diffStart = 7 + diffStart;
        }
        diffStart = prevMonthObj.daysInMonth - diffStart + 1;
        for (var i1 = diffStart; i1 <= prevMonthObj.daysInMonth; i1++) {
          days.push({
            date:
              prevMonthObj.yearN +
              '-' +
              helpers.z(prevMonthObj.monthN) +
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
            date:
              selectedYearN +
              '-' +
              helpers.z(selectedMonthN) +
              '-' +
              helpers.z(i2),
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
              nextMonthObj.yearN +
              '-' +
              helpers.z(nextMonthObj.monthN) +
              '-' +
              helpers.z(i3),
            n: i3,
            c: '',
            k: ['calendar__day--another-month'],
          });
        }

        return days;
      };

      var calendarData = function (data, periodLength, days) {
        // maximum date that is less than or equal the first day of the visible month
        // TODO what is this?
        var floor;
        var firstDay = days[0].date;
        var firstDayDate = dates.newDate(firstDay);
        for (var i5 = 0; i5 < data.quicklist.length; i5++) {
          if (data.quicklist[i5] <= firstDay) {
            floor = data.quicklist[i5]; // eslint-disable-line no-unused-vars
            break;
          }
        }

        // minimum date that is greater than the last day of the visible month
        var ceiling;
        var lastDay = days[days.length - 1].date;
        var lastDayDate = dates.newDate(lastDay);
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
          var lastEventDate = dates.newDate(sliceOfDates[0]);
          var daysLastSinceLastEvent =
            lastDayDate.diffDate(lastEventDate, 'days') + 1;
          if (daysLastSinceLastEvent > data.average) {
            var daysFirstSinceLastEvent =
              firstDayDate.diffDate(lastEventDate, 'days') + 1;
            var daysFirstDiff = daysFirstSinceLastEvent % data.average;
            var n = firstDayDate
              .cloneDate()
              .subtractDate(daysFirstDiff - 1, 'days');
            sliceOfDates = [n.formatDate(helpers.datePattern)];
            var daysEndDiff = daysFirstDiff + days.length;
            var quotient = Math.floor(daysEndDiff / data.average);
            for (var q = 0; q <= quotient; q++) {
              n.addDate(data.average, 'days');
              sliceOfDates.unshift(n.formatDate(helpers.datePattern));
            }
          }
        }

        var firstEventDate = dates.newDate(
          sliceOfDates[sliceOfDates.length - 1]
        );
        var counter = firstDayDate.diffDate(firstEventDate, 'days') + 1;
        var actual = false;

        var todayStr = helpers.todayStr;
        days.forEach(function (item) {
          if (sliceOfDates.indexOf(item.date) !== -1) {
            counter = 1;
          }
          if (counter) {
            // TODO check this if
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
          if (item.c === 1) {
            if (data.quicklist.indexOf(item.date) !== -1) {
              actual = true;
              item.k.push('calendar__day--selected');
            } else {
              actual = false;
              item.k.push('calendar__day--selected-future');
            }
          } else if (item.c > 1 && item.c <= periodLength) {
            if (actual) {
              item.k.push('calendar__day--selected');
            } else {
              item.k.push('calendar__day--selected-future');
            }
          } else {
            actual = false;
          }
        });

        return days;
      };

      /**
       * @param {object} data
       * @param {number} startDayOfWeek - 0 Sunday, 1 Monday, 6 Saturday
       * @param {number} monthN - Selected month number
       * @param {number} yearN - Selected year number
       */
      var calendarGet = (
        data,
        startDayOfWeek,
        periodLength,
        selectedMonthN,
        selectedYearN
      ) => {
        const todayMonthN = helpers.today.formatDate('M');
        const todayYearN = helpers.today.formatDate('YYYY');

        selectedMonthN = selectedMonthN || todayMonthN;
        selectedYearN = selectedYearN || todayYearN;

        // TODO clean variable names
        const giulia = this._calendarChrome(
          startDayOfWeek,
          selectedMonthN,
          selectedYearN
        );

        var days = calendarDays(
          startDayOfWeek,
          selectedMonthN,
          selectedYearN,
          giulia.prevMonthObj,
          giulia.nextMonthObj
        );

        days = calendarData(data, periodLength, days);

        var res = {
          days: days,
          week: giulia.weekTitle,
          title: giulia.title,
          next: giulia.nextMonthObj,
          prev: giulia.prevMonthObj,
          nextYear: giulia.nextYearObj,
          prevYear: giulia.prevYearObj,
          current: giulia.todayObj,
        };

        return res;
      };

      return calendarGet(
        data,
        startDayOfWeek,
        periodLength,
        selectedMonthN,
        selectedYearN
      );
    };
  };

  window.calendar = new Calendar();
})(window);
