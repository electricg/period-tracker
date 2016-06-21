/* global moment, z */
(function(window) {
  'use strict';

  var Template = function(settings) {
    var _self = this;
    _self.settings = settings;
    
    var _today = moment();
    var _week = moment.weekdaysShort();

    var calendarGet = function(data, startDayOkWeek, monthN, yearN) {
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
      var leftoverWeek = week.splice(0, startDayOkWeek);
      week = week.concat(leftoverWeek);
      
      var nextMonth = first.clone().add(1, 'months');
      var prevMonth = first.clone().subtract(1, 'months');
      var daysInPrevMonth = prevMonth.daysInMonth();
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

      var diffStart = firstDayOkWeek - startDayOkWeek;
      var k;
      var n;
      var c = '';
      var date;
      var start;
      var future = false;

      // before
      if (diffStart < 0) {
        diffStart = 7 + diffStart;
      }
      for (var i1 = diffStart - 1; i1 >= 0; i1--) {
        n = daysInPrevMonth - i1;
        k = ['another-month'];
        date = prev.yearN + '-' + z(prev.monthN) + '-' + z(n);
        days.push({
          date: date,
          n: n,
          c: c,
          k: k
        });
      }
      // during
      for (var i2 = 1; i2 <= daysInMonth; i2++) {
        n = i2;
        k = [];
        date = yearN + '-' + z(monthN) + '-' + z(i2);
        days.push({
          date: date,
          n: n,
          c: c,
          k: k
        });
      }
      // after
      var diffEnd = (startDayOkWeek - 1) - lastDayOfWeek;
      if (diffEnd < 0 ) {
        diffEnd = 7 + diffEnd;
      }
      for (var i3 = 1; i3 <= diffEnd; i3++) {
        n = i3;
        k = ['another-month'];
        date = next.yearN + '-' + z(next.monthN) + '-' + z(i3);
        days.push({
          date: date,
          n: n,
          c: c,
          k: k
        });
      }

      // loop through quicklist to find event that starts before the range or on its first very date
      for (var i4 = 0; i4 < data.quicklist.length; i4++) {
        if (data.quicklist[i4] <= days[0].date) {
          start = data.quicklist[i4];
          break;
        }
      }
      if (start) {
        var a = moment(days[0].date);
        var b = moment(start);
        c = a.diff(b, 'days') + 1;
      }

      days.forEach(function(item) {
        if (data.quicklist.indexOf(item.date) !== -1) {
          c = 1;
        }
        else if (item.date === data.next) {
          c = 1;
          future = true;
        }
        if (c) {
          item.c = c;
          c++;
        }
        if (future) {
          item.k.push('future');
        }
      });

      return {
        days: days,
        week: week,
        title: title,
        next: next,
        prev: prev
      };
    };

    this.calendar = function(data, monthN, yearN) {
      var _startDayOkWeek = _self.settings.get('startDayOkWeek');
      var cal = calendarGet(data, _startDayOkWeek, monthN, yearN);
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
          table += '<td data-counter="' + cal.days[dd].c + '"' + (cal.days[dd].k.length ? ' class="' + cal.days[dd].k.join(' ') + '"' : '') +'>' + cal.days[dd].n + '</td>';
        }
        table += '</tr>';
      }
      table += '</tbody></table>';

      return table;
    };

    this.log = function(data) {
      var table = '<table class="log"><tbody>';
      data.list.forEach(function(item, index) {
        var s = moment(item.date).format('MMM D, YYYY');
        table += '<tr><td>' + s + '</td><td>' + (typeof data.intervals[index] !== 'undefined' ? data.intervals[index] : '') + '</td>';
        table += '<td><button data-id="' + item.id + '" data-date="' + item.date + '" class="log-button js-edit" title="Edit"><svg class="icon log-icon"><use xlink:href="#icon-edit"></use></svg></button></td><td><button data-id="' + item.id + '" data-date="' + s + '" class="log-button js-remove" title="Remove"><svg class="icon log-icon"><use xlink:href="#icon-delete"></use></svg></button></td></tr>';
      });
      table += '</tbody></table>';

      return table;
    };
  };

  window.app = window.app || {};
  window.app.Template = Template;
})(window);