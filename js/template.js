/* global moment */
(function(window) {
  'use strict';

  var Template = function(options) {
    var _startDayOkWeek = options.startDayOkWeek || 0;
    var _today = moment();
    var _week = moment.weekdaysShort();

    var calendarGet = function(monthN, yearN) {
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

    this.calendar = function(data, monthN, yearN) {
      var cal = calendarGet(monthN, yearN);
      var table = '<table class="calendar"><thead><tr>';
      table += '<th><a href="#/calendar/' + cal.prev.yearN + '/' + cal.prev.monthN + '" title="' + cal.prev.title + '"><svg class="icon calendar-icon"><use xlink:href="#icon-prev"></use></svg></a></th>';
      table += '<th colspan="5">' + cal.title + '</th>';
      table += '<th><a href="#/calendar/' + cal.next.yearN + '/' + cal.next.monthN + '" title="' + cal.next.title + '"><svg class="icon calendar-icon"><use xlink:href="#icon-next"></use></svg></a></th></tr><tr class="calendar-weekdays">';
      cal.week.forEach(function(day) {
        table += '<th>' + day + '</th>';
      });
      table += '</tr></thead><tbody>';
      for (var d = 0; d < cal.days.length; d+=7) {
        table += '<tr>';
        for (var dd = d; dd < (d+7); dd++) {
          table += '<td>' + cal.days[dd] + '</td>';
        }
        table += '</tr>';
      }
      table += '</tbody></table>';

      return table;
    };

    this.log = function(data) {
      var table = '<table class="log"><tbody>';
      data.list.forEach(function(item, index) {
        table += '<tr><td>' + item.date + '</td><td>' + (typeof data.intervals[index] !== 'undefined' ? data.intervals[index] : '') + '</td>';
        table += '<td><button class="log-button" title="Edit"><svg class="icon log-icon"><use xlink:href="#icon-edit"></use></svg></button></td><td><button class="log-button" title="Delete"><svg class="icon log-icon"><use xlink:href="#icon-delete"></use></svg></button></td></tr>';
      });
      table += '</tbody></table>';

      return table;
    };
  };

  window.app = window.app || {};
  window.app.Template = Template;
})(window);