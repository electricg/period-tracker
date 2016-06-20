/* global app, populateUI */

var p = new app.Model('periodTracker');
p.init();

console.log('list', p.list);
console.log('intervals', p.intervals);
console.log('average', p.average);
console.log('next', p.next);
console.log('countdown', p.countdown);

// populateUI(p);


// var storage = new app.Store('periodTracker');

var calendar = new app.Calendar({
  startDayOkWeek: 1
});
calendar.draw();

window.addEventListener('hashchange', function(event) {
  console.log(document.location.hash);

  var pathArr = document.location.hash.split('/');
  var section = pathArr[1];

  if (section === 'calendar') {
    var yearN = pathArr[2];
    var monthN = pathArr[3];
    calendar.draw(monthN, yearN);
  }
});