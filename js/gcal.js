/* global gapi */
(function(window) {
  'use strict';

  var Gcal = function(clientId, scopes, title, namespace, onload) {
    var _self = this;

    var _authorized = false;
    var _settings = {};
    var _user = {};

    Object.defineProperty(this, 'onload', {
      get: function() {
        return onload;
      }
    });

    /**
     * Initialize the api
     */
    var loadScript = function() {
      var el = document.createElement('script');
      el.setAttribute('src', 'https://apis.google.com/js/client.js?onload=' + onload);
      document.body.appendChild(el);
    };

    /**
     * Write settings in localStorage
     */
    var save = function() {
      try {
        localStorage.setItem(namespace + 'Gcal', JSON.stringify(_settings));
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    };

    /**
     * Check amd start authorization
     * @param {boolean} immediate - False to open popup
     */
    var authorize = function(immediate) {
      return new Promise(function(resolve, reject) {
        gapi.auth.authorize({
          'client_id': clientId,
          'scope': scopes.join(' '),
          'immediate': immediate,
          'cookie_policy': 'single_host_origin'
        }, function(authResult) {
          if (authResult && !authResult.error) {
            console.log('authorized');
            _authorized = true;
            _settings.enabled = true;
            save();
            // resolve(authResult);
            resolve(getUser());
          } else {
            console.log('not authorized');
            _authorized = false;
            _settings.enabled = false;
            save();
            reject(authResult.error);
          }
        });
      });
    };

    /**
     * Get user info
     */
    var getUser = function() {
      return new Promise(function(resolve) {
        gapi.client.load('oauth2', 'v2', function() {
          gapi.client.oauth2.userinfo.get()
          .execute(function(res) {
            _user = {
              email: res.email,
              name: res.name,
              image: res.picture
            };
            resolve(_user);
          });
        });
      });
    };

    /**
     * Load Google Calendar client library
     */
    var loadCalendarApi = function() {
      return gapi.client.load('calendar', 'v3');
    };

    /**
     * Get calendar
     */
    var getCalendar = function() {
      return new Promise(function(resolve) {
        if (_settings.calendarId) {
          return resolve(_settings.calendarId);
        }
        
        var request = gapi.client.calendar.calendarList.list();
        
        request.execute(function(resp) {
          var calendars = resp.items;
          for (var i = 0; i < calendars.length; i++) {
            if (calendars[i].summary === title) {
              _settings.calendarId = calendars[i].id;
              save();
              return resolve(_settings.calendarId);
            }
          }

          return createCalendar();
        });
      });
    };

    /**
     * Create calendar
     */
    var createCalendar = function() {
      return new Promise(function(resolve) {
        var request = gapi.client.calendar.calendars.insert({
          'summary': title
        });

        request.execute(function(resp) {
          _settings.calendarId = resp.id;
          save();
          return resolve(_settings.calendarId);
        });
      });
    };

    /**
     * Get events from calendar
     * @param {string} id
     */
    var getEvents = function(id) {
      return new Promise(function(resolve) {
        var request = gapi.client.calendar.events.list({
          'calendarId': id,
          'singleEvents': true,
          'orderBy': 'startTime',
          'showDeleted': true
        });

        request.execute(function(resp) {
          resolve(resp.items);
        });
      });
    };

    /**
     * Parse downloaded data into our standard
     * @param {object} data
     */
    var parseEvents = function(data) {
      return new Promise(function(resolve) {
        var parsedData = [];
        data.forEach(function(item) {
          var newItem = {};
          try {
            newItem = JSON.parse(item.summary);
          } catch (e) {
            
          }
          newItem._date = item.start.date || item.start.dateTime;
          newItem.active = item.status === 'cancelled' ? false : true;
          parsedData.push(newItem);
        });

        resolve(parsedData);
      });
    };

    /**
     * Disconnect from remote account
     */
    var disconnect = function() {
      gapi.auth.signOut();
      _authorized = false;
      _settings.enabled = false;
      save();
    };

    /**
     * Function to call when we first load the page
     */
    this.firstLoad = function() {
      try {
        _settings = JSON.parse(localStorage.getItem(namespace + 'Gcal')) || {};
      } catch (e) {
        console.error(e);
        _settings = {};
      }
      if (_settings.enabled && _settings.calendarId) {
        loadScript();
      }
    };

    /**
     * Do everything
     */
    this.checkAuth = function(immediate) {
      return authorize(immediate)
      .then(loadCalendarApi)
      .then(_self.fetchEvents);
    };

    /**
     * Get the events in our format
     */
    this.fetchEvents = function() {
      return getCalendar()
      .then(getEvents)
      .then(parseEvents)
      .then(function(res) {
        return {
          events: res,
          user: _user
        };
      });
    };

    this.toggle = function(connectCb, disconnectCb) {
      if (_authorized) {
        disconnect();
        disconnectCb();
      }
      else {
        if (typeof gapi === 'undefined') {
          loadScript();
        }
        else {
          connectCb();
        }
      }
    };

    /**
     * Create an event
     * @param {object} data
     * @param {function} callback
     */
    this.add = function(data, callback) {
      if (!_authorized) {
        return;
      }
      gapi.client.load('calendar', 'v3', function() {
        var request = gapi.client.calendar.events.insert({
          'calendarId': _settings.calendarId
        }, {
          start: {
            date: data.date
          },
          end: {
            date: data.date
          },
          summary: JSON.stringify(data)
        });

        request.execute(function(resp) {
          callback(resp);
        });
      });
    };

    /**
     * Update an event
     * @param {string} id
     * @param {object} data
     * @param {function} callback
     */
    this.edit = function(id, data, callback) {
      if (!_authorized) {
        return;
      }
      gapi.client.load('calendar', 'v3', function() {
        var request = gapi.client.calendar.events.update({
          'calendarId': _settings.calendarId,
          'eventId': id
        }, {
          start: {
            date: data.date
          },
          end: {
            date: data.date
          },
          summary: JSON.stringify(data)
        });

        request.execute(function(resp) {
          callback(resp);
        });
      });
    };

    /**
     * Delete an event
     * @param {string} id
     * @param {function} callback
     */
    this.remove = function(id, callback) {
      if (!_authorized) {
        return;
      }
      gapi.client.load('calendar', 'v3', function() {
        var request = gapi.client.calendar.events.delete({
          'calendarId': _settings.calendarId,
          'eventId': id
        });

        request.execute(function(resp) {
          callback(resp);
        });
      });
    };

    /**
     * Remove all events
     * @param {function} callback
     */
    this.clear = function(callback) {
      if (!_authorized) {
        return;
      }
      // TODO
      gapi.client.load('calendar', 'v3', function() {
        var request = gapi.client.calendar.calendars.clear({
          'calendarId': _settings.calendarId
        });

        request.execute(function(resp) {
          callback(resp);
        });
      });
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.Gcal = Gcal;
})(window);