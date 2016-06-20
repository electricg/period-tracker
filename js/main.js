/* global app, populateUI */

var p = new app.Model('periodTracker');
p.init();

// console.log('list', p.list);
// console.log('intervals', p.intervals);
// console.log('average', p.average);
// console.log('next', p.next);
// console.log('countdown', p.countdown);

populateUI(p);