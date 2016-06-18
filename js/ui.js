/* global moment */
/* exported populateUI */

// var $ = document.querySelectorAll.bind(document);
var $$ = document.querySelector.bind(document);
Element.prototype.on = Element.prototype.addEventListener;

function prev(event) {
  if (event.preventDefault) { event.preventDefault(); }
  else { event.returnValue = false; }
}


var $wrapper = $$('#wrapper');
var $form = $$('#form');
var $date = $$('#date');
var $average = $$('#average');
var $list = $$('#list');

$form.on('submit', function(event) {
  prev(event);
  console.log($date.value);
});


var $next = $$('#next');
var $countdown = $$('#countdown');


var populateUI = function(p) {
  $next.innerHTML = moment(p.next).format('ddd, MMM D');
  $countdown.innerHTML = p.countdown;
  $average.innerHTML = p.average;

  var table = '';
  for (var i = 0; i < p.list.length; i++) {
    table += '<tr id="tr' + p.list[i] + '"><td>';
    table += moment(p.list[i]).format('MMM D, YYYY');
    table += '</td><td>';
    table += p.intervals[i] == null ? '' : p.intervals[i];
    table += '</td></tr>';
  }
  $list.innerHTML = table;

  // $wrapper.classList.toggle('hide');
};