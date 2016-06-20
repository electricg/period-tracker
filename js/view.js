/* global $, $$ */
(function(window) {
  'use strict';

  /**
   * View
   */
  var View = function(template) {
    var _self = this;
    _self.template = template;

    var $sections = $('.main-section');
    var $navLinks = $('.main-nav a');
    var $next = $$('#next');
    var $countdown = $$('#countdown');
    var $cal = $$('#calendar-data');
    var $average = $$('#average');
    var $log = $$('#log-data');
    
    var _viewCommands = {};

    _viewCommands.section = function(model, parameter, args) {
      parameter = parameter || 'home';
      $sections.forEach(function($el) {
        $el.classList.remove('selected');
      });
      $$('#' + parameter).classList.add('selected');
      $navLinks.forEach(function($el) {
        if ($el.getAttribute('href') === '#/' + parameter) {
          $el.classList.add('selected');
        }
        else {
          $el.classList.remove('selected');
        }
      });
      if (parameter === 'calendar') {
        var yearN = args[0];
        var monthN = args[1];
        _viewCommands.calendar(model, monthN, yearN);
      }
    };

    _viewCommands.home = function(model) {
      $next.innerHTML = model.next;
      $countdown.innerHTML = model.countdown;
    };

    _viewCommands.calendar = function(model, month, year) {
      $cal.innerHTML = _self.template.calendar(model, month, year);
    };

    _viewCommands.log = function(model) {
      $average.innerHTML = model.average;
      $log.innerHTML = _self.template.log(model);
    };

    _viewCommands.settings = function() {
      console.log('settings');
    };

    this.render = function(viewCmd, model, parameter, args) {
      _viewCommands[viewCmd](model, parameter, args);
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.View = View;
})(window);