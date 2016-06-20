/* global moment, $$ */
(function(window) {
  'use strict';

  var Calendar = function(options) {
    var _startDayOkWeek = options.startDayOkWeek || 0;
    var _today = moment();
    var _week = moment.weekdaysShort();

    this.get = function(monthN, yearN) {
      monthN = monthN || _today.format('M');
      yearN = yearN || _today.format('YYYY');

      var first = moment(yearN + '-' + monthN, 'YYYY-M');
      var firstDayOkWeek = first.format('d');
      var daysInMonth = first.daysInMonth();
      var last = moment(yearN + '-' + monthN + '-' + daysInMonth, 'YYYY-M-D');
      var lastDayOfWeek = last.format('d');

      var days = [];
      var title = first.format('MMMM YYYY');
      var week = _week.slice(0);
      var leftoverWeek = week.splice(0, _startDayOkWeek);
      week = week.concat(leftoverWeek);
      
      var nextMonth = first.clone().add(1, 'months');
      var prevMonth = first.clone().subtract(1, 'months');
      var next = {
        monthN: nextMonth.format('M'),
        yearN: nextMonth.format('YYYY'),
        title: nextMonth.format('MMMM YYYY')
      };
      var prev = {
        monthN: prevMonth.format('M'),
        yearN: prevMonth.format('YYYY'),
        title: prevMonth.format('MMMM YYYY')
      };

      var diffStart = firstDayOkWeek - _startDayOkWeek;
      if (diffStart < 0) {
        diffStart = 7 + diffStart;
      }
      for (var i = 0; i < diffStart; i++) {
        days.push('');
      }
      for (var d = 1; d <= daysInMonth; d++) {
        days.push(d);
      }
      var diffEnd = (_startDayOkWeek - 1) - lastDayOfWeek;
      if (diffEnd < 0 ) {
        diffEnd = 7 + diffEnd;
      }
      for (var e = 0; e < diffEnd; e++) {
        days.push('');
      }

      return {
        days: days,
        week: week,
        title: title,
        next: next,
        prev: prev
      };
    };

    this.draw = function(monthN, yearN) {
      var cal = this.get(monthN, yearN);
      var $cal = $$('#calendar');
      var table = '<table border="1"><thead><tr>';
      table += '<th><a href="#/calendar/' + cal.prev.yearN + '/' + cal.prev.monthN + '/" title="' + cal.prev.title + '">&ltrif;</a></th>';
      table += '<th colspan="5">' + cal.title + '</th>';
      table += '<th><a href="#/calendar/' + cal.next.yearN + '/' + cal.next.monthN + '/" title="' + cal.next.title + '">&rtrif;</a></th></tr><tr>';
      for (var w = 0; w < cal.week.length; w++) {
        table += '<td>' + cal.week[w] + '</td>';
      }
      table += '</tr></thead><tbody>';
      for (var d = 0; d < cal.days.length; d+=7) {
        table += '<tr>';
        for (var dd = d; dd < (d+7); dd++) {
          table += '<td>' + cal.days[dd] + '</td>';
        }
        table += '</tr>';
      }
      table += '</tbody></table>';

      $cal.innerHTML = table;
    };
  };

  window.app = window.app || {};
  window.app.Calendar = Calendar;
})(window);