/* global $, $$, dates, helpers, VERSION */
'use strict';

(function (window) {
  /**
   * View
   */
  var View = function (template) {
    var _self = this;
    _self.template = template;
    _self.config = _self.template.config;

    var $sections = $('.main-section');
    var $navLinks = $('.main-nav a');

    var $homeCalc = $$('#home-calc');
    var $next = $$('#next');
    var $countdown = $$('#countdown');
    var $counter = $$('#counter');
    var $homeAdd = $$('#home-add');
    var $addFormToggle = $('.add-form__toggle');
    var $addForm = $('.add-form');
    var $addDate = $('input[name="add-date"]');

    var $editForm = $$('#edit-form--log');
    var $editFormTr = $$('#edit-form--log-tr');

    var $cal = $$('#calendar-data');
    var $average = $$('#average');
    var $log = $$('#log-data');

    var $importData = $$('#import-data');
    var $exportData = $$('#export-data');
    var $shareData = $$('#share-data');
    var $deleteAll = $$('#delete-all');
    var $settingsWeekStart = $$('#settings-week-start');
    var $settingsExtendedMonth = $$('#settings-extended-month');

    var $settingsPeriodLength = $$('#settings-period-length');
    var $settingsCycleLength = $$('#settings-cycle-length');

    var $alerts = $$('#alerts');

    var $statusOffline = $$('#status-icon-offline');

    var $version = $$('#version');

    var _viewCommands = {};

    _viewCommands.alert = function (type, msg) {
      $alerts.innerHTML += _self.template.alert(type, msg);
    };

    _viewCommands.info = function (err) {
      _viewCommands.alert('info', err);
    };
    this.giulia = function () {
      _viewCommands.alert('info', 'ciao');
      _viewCommands.alert('error', 'ciao');
      _viewCommands.alert('success', 'ciao');
      _viewCommands.alert('warning', 'ciao');
    };

    _viewCommands.error = function (err) {
      _viewCommands.alert('error', err);
    };

    _viewCommands.success = function (err) {
      _viewCommands.alert('success', err);
    };

    _viewCommands.warning = function (err) {
      _viewCommands.alert('warning', err);
    };

    _viewCommands.section = function (model, parameter, args) {
      parameter = parameter || 'home';
      $sections.forEach(function ($el) {
        $el.classList.remove('main-section--selected');
      });
      let $selectedSection = $$('#' + parameter);

      if (!$selectedSection) {
        parameter = 'not-found';
        $selectedSection = $$('#' + parameter);
      }

      $selectedSection.classList.add('main-section--selected');
      $navLinks.forEach(function ($el) {
        if ($el.getAttribute('href') === '#/' + parameter) {
          $el.classList.add('main-nav__link--selected');
        } else {
          $el.classList.remove('main-nav__link--selected');
        }
      });
      if (parameter === 'calendar') {
        let yearN = args[0];
        let monthN = args[1];

        const todayMonthN = helpers.today.getDate('month');
        const todayYearN = helpers.today.getDate('year');

        monthN = parseInt(monthN) || todayMonthN;
        yearN = parseInt(yearN) || todayYearN;

        _viewCommands.calendar(model, monthN, yearN);
      }
    };

    _viewCommands.chrome = function () {
      $version.innerHTML = VERSION;
    };

    _viewCommands.home = function (model) {
      $next.innerHTML = model.next
        ? dates.formatOnce(model.next, 'ddd, MMM D')
        : '';
      $next.setAttribute('datetime', model.next ? model.next : '');
      $countdown.innerHTML = model.countdown;
      $counter.innerHTML = model.counter;
      $homeCalc.classList.toggle('home__calc--invisible', !model.next);
      var todayStr = helpers.todayStr;
      $addDate.forEach(function ($el) {
        $el.defaultValue = todayStr;
        $el.value = todayStr;
        $el.max = todayStr;
      });
      // hide add button if we are into the period time
      $homeAdd.classList.toggle(
        'home_add--hide',
        model.counter > 0 && model.counter <= _self.config.get('periodLength')
      );
    };

    _viewCommands.calendar = function (model, month, year) {
      $cal.innerHTML = _self.template.calendar(model, month, year);
    };

    _viewCommands.log = function (model) {
      $average.innerHTML = model.average;
      $log.innerHTML = _self.template.log(model);
    };

    _viewCommands.settings = function () {
      if (_self.config.get('startDayOfWeek')) {
        $settingsWeekStart.checked = true;
      } else {
        $settingsWeekStart.checked = false;
      }
      if (_self.config.get('showExtendedMonth')) {
        $settingsExtendedMonth.checked = true;
      } else {
        $settingsExtendedMonth.checked = false;
      }
      $settingsPeriodLength.value = _self.config.get('periodLength');
      $settingsCycleLength.value = _self.config.get('cycleLength');
    };

    _viewCommands.offline = function (status) {
      $statusOffline.classList.toggle(
        'main-header__status__icon--active',
        status
      );
    };

    this.render = function (viewCmd, model, parameter, args) {
      _viewCommands[viewCmd](model, parameter, args);
    };

    this.bind = function (event, handler) {
      if (event === 'itemAdd') {
        $addFormToggle.forEach(function ($el) {
          $el.on('click', function () {
            this.form.classList.add('add-form--selected');
            this.form.elements['add-date'].focus();
            this.form.elements['add-date'].click();
          });
        });

        $addForm.forEach(function ($el) {
          $el.on('submit', function (event) {
            event.preventDefault();
            var res = handler(this.elements['add-date'].value);
            if (res !== -1) {
              this.reset();
            }
          });
        });
        $addForm.forEach(function ($el) {
          $el.on('reset', function () {
            this.classList.remove('add-form--selected');
          });
        });
      } else if (event === 'itemRemove') {
        helpers.$delegate($log, '.js-remove', 'click', function () {
          var $tr = this.parentNode.parentNode;
          $log
            .querySelectorAll('.log-list__item--selected')
            .forEach(function ($el) {
              $el.classList.remove('log-list__item--selected');
            });
          $tr.classList.add('log-list__item--selected');
          // When showed a confirm dialog in Chrome and similar browsers, earlier DOM changes are not yet visible, hence the delay with setTimeout
          // https://stackoverflow.com/a/59286014
          setTimeout(() => {
            if (
              window.confirm(
                'Are you sure you want to delete `' +
                  this.getAttribute('data-date') +
                  '`?'
              )
            ) {
              handler(this.getAttribute('data-id'));
            } else {
              $tr.classList.toggle('log-list__item--selected');
            }
          }, 0);
        });
      } else if (event === 'showItemEdit') {
        helpers.$delegate($log, '.js-edit', 'click', function () {
          var id = this.getAttribute('data-id');
          var $tr = this.parentNode.parentNode;
          var { date } = handler(id);

          $editForm.elements['edit-id'].value = id;
          $editForm.elements['edit-date'].value = date;
          $editForm.elements['edit-date'].max = helpers.todayStr;

          $log
            .querySelectorAll('.log-list__item--selected')
            .forEach(function ($el) {
              $el.classList.remove('log-list__item--selected');
            });
          $tr.classList.add('log-list__item--selected');
          $tr.parentNode.insertBefore($editFormTr, $tr.nextSibling);
        });
        $editForm.on('reset', function () {
          if ($editFormTr.previousSibling) {
            $editFormTr.previousSibling.classList.remove(
              'log-list__item--selected'
            );
          }
          $editFormTr.remove();
        });
      } else if (event === 'itemEdit') {
        $editForm.on('submit', function (event) {
          event.preventDefault();
          var res = handler(
            this.elements['edit-id'].value,
            this.elements['edit-date'].value
          );
          if (res !== -1) {
            this.reset();
          }
        });
      } else if (event === 'importData') {
        $importData.on('click', function (event) {
          if (
            !window.confirm(
              'This will completely overwrite the data. Do you want to continue?'
            )
          ) {
            event.preventDefault();
          }
        });
        $importData.on('change', function () {
          const [file] = $importData.files;
          handler(file);
        });
      } else if (event === 'exportData') {
        $exportData.on('click', function () {
          handler();
        });
      } else if (event === 'shareData') {
        $shareData.on('click', function () {
          handler();
        });
      } else if (event === 'itemRemoveAll') {
        $deleteAll.on('click', function () {
          if (
            window.confirm(
              'Are you sure you want to delete all the entries and reset the settings?'
            )
          ) {
            handler();
          }
        });
      } else if (event === 'settingsUpdate') {
        var data = {};

        $settingsWeekStart.on('change', function () {
          if (this.checked) {
            data.startDayOfWeek = 1;
          } else {
            data.startDayOfWeek = 0;
          }
          handler(data);
        });

        $settingsExtendedMonth.on('change', function () {
          if (this.checked) {
            data.showExtendedMonth = true;
          } else {
            data.showExtendedMonth = false;
          }
          handler(data);
        });

        $settingsPeriodLength.on('input', function () {
          data.periodLength = this.value * 1;
          handler(data);
        });

        $settingsCycleLength.on('input', function () {
          data.cycleLength = this.value * 1;
          handler(data);
        });

        $('.js-number').forEach(function ($item) {
          var $add = $item.querySelector('.js-number__add');
          var $sub = $item.querySelector('.js-number__sub');
          var $input = $item.querySelector('.js-number__input');
          var min = $input.min ? Number($input.min) : null;
          var max = $input.max ? Number($input.max) : null;
          // TODO maybe disable the buttons when cannot go above/below min/max
          $sub.on('click', function () {
            if (min !== null && $input.value <= min) {
              return;
            }
            $input.value--;
            $input.dispatchEvent(new Event('input'));
          });
          $add.on('click', function () {
            if (max !== null && $input.value >= max) {
              return;
            }
            $input.value++;
            $input.dispatchEvent(new Event('input'));
          });
        });
      }
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.View = View;
})(window);
