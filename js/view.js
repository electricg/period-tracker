/* global $, $$, $delegate, prev, moment, version */
(function(window) {
  'use strict';

  /**
   * View
   */
  var View = function(template) {
    var _self = this;
    _self.template = template;
    _self.settings = _self.template.settings;

    var $sections = $('.main-section');
    var $navLinks = $('.main-nav a');
    var $next = $$('#next');
    var $countdown = $$('#countdown');
    var $homeAdd = $$('#home-add');
    var $addForm = $$('#add-form');
    var $addDate = $$('#add-date');

    var $cal = $$('#calendar-data');
    var $average = $$('#average');
    var $log = $$('#log-data');

    var $deleteAll = $$('#delete-all');
    var $settingsWeekStart = $$('#settings-week-start');

    var $settingsPeriodLength = $$('#settings-period-length');
    var $settingsCycleLength = $$('#settings-cycle-length');

    var $alert = $$('#alert');

    var $statusOffline = $$('#status-icon-offline');

    $$('#version').innerHTML = version;
    
    var _viewCommands = {};

    _viewCommands.alert = function(type, msg) {
      $alert.innerHTML += _self.template.alert(type, msg);
    };

    _viewCommands.info = function(err) {
      _viewCommands.alert('info', err);
    };

    _viewCommands.error = function(err) {
      _viewCommands.alert('error', err);
    };

    _viewCommands.success = function(err) {
      _viewCommands.alert('success', err);
    };

    _viewCommands.warning = function(err) {
      _viewCommands.alert('warning', err);
    };

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
      $next.innerHTML = model.next ? moment(model.next).format('ddd, MMM D') : '';
      $countdown.innerHTML = model.countdown;
      var today = moment().format('YYYY-MM-DD');
      $addDate.defaultValue = today;
      $addDate.value = today;
    };

    _viewCommands.calendar = function(model, month, year) {
      $cal.innerHTML = _self.template.calendar(model, month, year);
    };

    _viewCommands.log = function(model) {
      $average.innerHTML = model.average;
      $log.innerHTML = _self.template.log(model);
    };

    _viewCommands.settings = function() {
      if (_self.settings.get('startDayOkWeek')) {
        $settingsWeekStart.checked = true;
      }
      else {
        $settingsWeekStart.checked = false;
      }
      $settingsPeriodLength.value = _self.settings.get('periodLength');
      $settingsCycleLength.value = _self.settings.get('cycleLength');
    };

    _viewCommands.offline = function(status) {
      $statusOffline.classList.toggle('status-icon-active', status);
    };

    this.render = function(viewCmd, model, parameter, args) {
      _viewCommands[viewCmd](model, parameter, args);
    };

    this.bind = function(event, handler) {
      if (event === 'itemAdd') {
        $homeAdd.on('click', function() {
          $addForm.classList.add('selected');
          $addDate.focus();
          $addDate.click();
        });
        $addForm.on('submit', function(event) {
          prev(event);
          var res = handler($addDate.value);
          if (res !== -1) {
            $addForm.reset();
          }
        });
        $addForm.on('reset', function() {
          $addForm.classList.remove('selected');
        });
      }
      else if (event === 'itemRemove') {
        $delegate($log, '.js-remove', 'click', function() {
          var $tr = this.parentNode.parentNode;
          $tr.classList.toggle('selected');
          if (window.confirm('Are you sure you want to delete `' + this.getAttribute('data-date') + '`?')) {
            handler(this.getAttribute('data-id'));
          }
          else {
            $tr.classList.toggle('selected');
          }
        });
      }
      else if (event === 'itemEdit') {
        $delegate($log, '.js-edit', 'click', function() {
          handler(this.getAttribute('data-id'));
        });
      }
      else if (event === 'itemRemoveAll') {
        $deleteAll.on('click', function() {
          if (window.confirm('Are you sure you want to delete all the entries?')) {
            handler();
          }
        });
      }
      else if (event === 'settingsUpdate') {
        var data = {};

        $settingsWeekStart.on('change', function() {
          if (this.checked) {
            data.startDayOkWeek = 1;
          }
          else {
            data.startDayOkWeek = 0;
          }
          handler(data);
        });

        $settingsPeriodLength.on('input', function() {
          data.periodLength = this.value * 1;
          handler(data);
        });

        $settingsCycleLength.on('input', function() {
          data.cycleLength = this.value * 1;
          handler(data);
        });

        $('.js-number').forEach(function($item) {
          var $add = $item.querySelector('.input-number-add');
          var $sub = $item.querySelector('.input-number-sub');
          var $input = $item.querySelector('.input-number-input');
          $sub.on('click', function() {
            if ($input.value <= 1) {
              return;
            }
            $input.value--;
            $input.dispatchEvent(new Event('input'));
          });
          $add.on('click', function() {
            $input.value++;
            $input.dispatchEvent(new Event('input'));
          });
        });
      }
      else if (event === 'alert') {
        $delegate($alert, '.js-close', 'click', function() {
          $alert.removeChild(this.parentNode);
          handler();
        });
      }
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.View = View;
})(window);