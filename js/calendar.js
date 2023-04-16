/* global dates, helpers */
'use strict';

(function (window) {
  const Calendar = function () {
    /**
     * @param {number} startDayOfWeek - 0 Sunday, 1 Monday, 6 Saturday
     * @param {number} selectedMonthN - Selected month number, 1 or 2 digits no zero leading
     * @param {number} selectedYearN - Selected year number, 4 digits
     */
    this._calendarChrome = (startDayOfWeek, selectedMonthN, selectedYearN) => {
      // rearrange weekday names starting from our own first day of the week
      const week = dates.weekdaysShort();
      let weekTitle = week.slice(0);
      const leftoverWeek = weekTitle.splice(0, startDayOfWeek);
      weekTitle = weekTitle.concat(leftoverWeek);

      const selectedMonthYear = dates.newDate(
        `${selectedYearN}-${selectedMonthN}`,
        'YYYY-M'
      );
      const title = selectedMonthYear.formatDate('MMMM YYYY');

      // previous and next month data for nav links
      const nextMonth = selectedMonthYear.cloneDate().addDate(1, 'months');
      const prevMonth = selectedMonthYear.cloneDate().addDate(-1, 'months');
      const nextMonthObj = {
        monthN: nextMonth.getDate('month'),
        yearN: nextMonth.getDate('year'),
        title: nextMonth.formatDate('MMMM YYYY'),
      };
      const prevMonthObj = {
        daysInMonth: prevMonth.daysInMonthDate(),
        monthN: prevMonth.getDate('month'),
        yearN: prevMonth.getDate('year'),
        title: prevMonth.formatDate('MMMM YYYY'),
      };

      // previous and next year data for nav links
      const nextYear = selectedMonthYear.cloneDate().addDate(1, 'years');
      const prevYear = selectedMonthYear.cloneDate().addDate(-1, 'years');
      const nextYearObj = {
        monthN: nextYear.getDate('month'),
        yearN: nextYear.getDate('year'),
        title: nextYear.formatDate('MMMM YYYY'),
      };
      const prevYearObj = {
        monthN: prevYear.getDate('month'),
        yearN: prevYear.getDate('year'),
        title: prevYear.formatDate('MMMM YYYY'),
      };

      // current month and year data for today link
      const todayObj = {
        monthN: helpers.today.getDate('month'),
        yearN: helpers.today.getDate('year'),
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

    /**
     * @param {number} startDayOfWeek - 0 Sunday, 1 Monday, 6 Saturday
     * @param {number} selectedMonthN - Selected month number, 1 or 2 digits no zero leading
     * @param {number} selectedYearN - Selected year number, 4 digits
     * @param {object} prevMonthObj
     * @param {object} nextMonthObj
     */
    this._calendarDays = (
      startDayOfWeek,
      selectedMonthN,
      selectedYearN,
      prevMonthObj,
      nextMonthObj
    ) => {
      let days = [];

      const thisMonth = dates.newDate(
        `${selectedYearN}-${selectedMonthN}`,
        'YYYY-M'
      );
      const weekdayFirstDayThisMonth = thisMonth.getDate('day');
      const daysInThisMonth = thisMonth.daysInMonthDate();
      const lastDayThisMonth = dates.newDate(
        selectedYearN + '-' + selectedMonthN + '-' + daysInThisMonth,
        'YYYY-M-D'
      );
      const weekdayLastDayThisMonth = lastDayThisMonth.getDate('day');

      // before
      let diffStart = weekdayFirstDayThisMonth - startDayOfWeek;
      if (diffStart < 0) {
        diffStart = 7 + diffStart;
      }
      diffStart = prevMonthObj.daysInMonth - diffStart + 1;
      for (let i = diffStart; i <= prevMonthObj.daysInMonth; i++) {
        days.push({
          date:
            prevMonthObj.yearN +
            '-' +
            helpers.z(prevMonthObj.monthN) +
            '-' +
            helpers.z(i),
          n: i,
          c: '',
          k: ['calendar__day--another-month'],
        });
      }
      // during
      for (let i = 1; i <= daysInThisMonth; i++) {
        days.push({
          date:
            selectedYearN +
            '-' +
            helpers.z(selectedMonthN) +
            '-' +
            helpers.z(i),
          n: i,
          c: '',
          k: [],
        });
      }
      // after
      let diffEnd = startDayOfWeek - 1 - weekdayLastDayThisMonth;
      if (diffEnd < 0) {
        diffEnd = 7 + diffEnd;
      }
      for (let i = 1; i <= diffEnd; i++) {
        days.push({
          date:
            nextMonthObj.yearN +
            '-' +
            helpers.z(nextMonthObj.monthN) +
            '-' +
            helpers.z(i),
          n: i,
          c: '',
          k: ['calendar__day--another-month'],
        });
      }

      return days;
    };

    this.calcCalendarData = function (
      data,
      startDayOfWeek,
      periodLength,
      selectedMonthN,
      selectedYearN
    ) {
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
       * @param {number} periodLength - Length of period
       * @param {number} selectedMonthN - Selected month number
       * @param {number} selectedYearN - Selected year number
       */
      var calendarGet = (
        data,
        startDayOfWeek,
        periodLength,
        selectedMonthN,
        selectedYearN
      ) => {
        // TODO clean variable names
        const giulia = this._calendarChrome(
          startDayOfWeek,
          selectedMonthN,
          selectedYearN
        );

        let days = this._calendarDays(
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
