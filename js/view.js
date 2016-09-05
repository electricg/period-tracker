/* global $, $$, $delegate, prev, moment */
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
    
    var $homeCalc = $$('#home-calc');
    var $next = $$('#next');
    var $countdown = $$('#countdown');
    var $counter = $$('#counter');
    var $homeAdd = $$('#home-add');
    var $addForm = $$('#add-form');
    var $addDate = $$('#add-date');

    var $cal = $$('#calendar-data');
    var $average = $$('#average');
    var $log = $$('#log-data');

    var $deleteAll = $$('#delete-all');
    var $settingsWeekStart = $$('#settings-week-start');
    var $settingsExtendedMonth = $$('#settings-extended-month');

    var $settingsPeriodLength = $$('#settings-period-length');
    var $settingsCycleLength = $$('#settings-cycle-length');

    var $alerts = $$('#alerts');

    var $statusOffline = $$('#status-icon-offline');

    var $gcalConnect = $$('#gcal-connect');
    var $gcalConnectOn = $$('#gcal-connect-on');
    var $gcalConnectOff = $$('#gcal-connect-off');
    var $gcalConnectUser = $$('#gcal-connect-user');

    var _viewCommands = {};

    _viewCommands.gcal = function(user) {
      if (user) {
        $gcalConnectUser.innerHTML = user.email; // + '<img src="' + user.image + '">';
        $gcalConnectOff.style.display = '';
        $gcalConnectOn.style.display = 'none';
      }
      else {
        $gcalConnectUser.innerHTML = '';
        $gcalConnectOn.style.display = '';
        $gcalConnectOff.style.display = 'none';
      }
    };

    _viewCommands.alert = function(type, msg) {
      $alerts.innerHTML += _self.template.alert(type, msg);
    };

    _viewCommands.info = function(err) {
      _viewCommands.alert('info', err);
    };
    this.giulia = function(){
      _viewCommands.alert('info', 'ciao');
      _viewCommands.alert('error', 'ciao');
      _viewCommands.alert('success', 'ciao');
      _viewCommands.alert('warning', 'ciao');
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
        $el.classList.remove('main-section--selected');
      });
      $$('#' + parameter).classList.add('main-section--selected');
      $navLinks.forEach(function($el) {
        if ($el.getAttribute('href') === '#/' + parameter) {
          $el.classList.add('main-nav__link--selected');
        }
        else {
          $el.classList.remove('main-nav__link--selected');
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
      $counter.innerHTML = model.counter;
      $homeCalc.classList.toggle('home__calc--invisible', !model.next);
      var today = moment().format('YYYY-MM-DD');
      $addDate.defaultValue = today;
      $addDate.value = today;
      // hide add button if we are into the period time
      $homeAdd.classList.toggle('home_add--hide', model.counter > 0 && model.counter <= _self.settings.get('periodLength'));
    };

    _viewCommands.calendar = function(model, month, year) {
      $cal.innerHTML = _self.template.calendar(model, month, year);
    };

    _viewCommands.log = function(model) {
      $average.innerHTML = model.average;
      $log.innerHTML = _self.template.log(model);
    };

    _viewCommands.settings = function() {
      if (_self.settings.get('startDayOfWeek')) {
        $settingsWeekStart.checked = true;
      }
      else {
        $settingsWeekStart.checked = false;
      }
      if (_self.settings.get('showExtendedMonth')) {
        $settingsExtendedMonth.checked = true;
      }
      else {
        $settingsExtendedMonth.checked = false;
      }
      $settingsPeriodLength.value = _self.settings.get('periodLength');
      $settingsCycleLength.value = _self.settings.get('cycleLength');
    };

    _viewCommands.offline = function(status) {
      $statusOffline.classList.toggle('main-header__status__icon--active', status);
    };

    this.render = function(viewCmd, model, parameter, args) {
      _viewCommands[viewCmd](model, parameter, args);
    };

    this.bind = function(event, handler) {
      if (event === 'itemAdd') {
        $homeAdd.on('click', function() {
          $addForm.classList.add('add-form--selected');
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
          $addForm.classList.remove('add-form--selected');
        });
      }
      else if (event === 'itemRemove') {
        $delegate($log, '.js-remove', 'click', function() {
          var $tr = this.parentNode.parentNode;
          $log.querySelectorAll('.log-list__item--selected').forEach(function($el) {
            $el.classList.remove('log-list__item--selected');
          });
          $tr.classList.add('log-list__item--selected');
          // TODO
          if (window.confirm('Are you sure you want to delete `' + this.getAttribute('data-date') + '`?')) {
            handler(this.getAttribute('data-id'));
          }
          else {
            $tr.classList.toggle('log-list__item--selected');
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
            data.startDayOfWeek = 1;
          }
          else {
            data.startDayOfWeek = 0;
          }
          handler(data);
        });

        $settingsExtendedMonth.on('change', function() {
          if (this.checked) {
            data.showExtendedMonth = true;
          }
          else {
            data.showExtendedMonth = false;
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
          var $add = $item.querySelector('.js-number__add');
          var $sub = $item.querySelector('.js-number__sub');
          var $input = $item.querySelector('.js-number__input');
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
      // else if (event === 'alert') {
      //   window.alertClose = function(el) {
      //     $alerts.removeChild(el.parentNode);
      //     handler();
      //   };
      // }
      else if (event === 'gcal') {
        $gcalConnect.on('click', function() {
          handler();
        });
      }
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.View = View;
})(window);