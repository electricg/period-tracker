/* global gapi */
(function(window) {
  'use strict';

  var Gcal = function(clientId, scopes, namespace) {
    var _self = this;

    var _calendarId = '';
    var _calendar;
    var _events;
    var _authorized = false;

    /**
     * Check if current user has authorized this application
     */
    var checkAuth = function() {
      return new Promise(function(resolve, reject) {
        gapi.auth.authorize({
          'client_id': clientId,
          'scope': scopes.join(' '),
          'immediate': true
        }, function(authResult) {
          if (authResult && !authResult.error) {
            // Hide auth UI, then load client library.
            console.log('authorized');
            _authorized = true;
            resolve();
          } else {
            // Show auth UI, allowing the user to initiate authorization by clicking authorize button.
            console.log('not authorized');
            _authorized = false;
            reject();
          }
        });
      });
    };

    /**
     * Load Google Calendar client library
     */
    var loadCalendarApi = function() {
      return new Promise(function(resolve) {
        gapi.client.load('calendar', 'v3', function() {
          resolve();
        });
      });
    };

    /**
     * Get calendar
     */
    var getCalendar = function() {
      return new Promise(function(resolve) {
        var request = gapi.client.calendar.calendarList.list();
        
        request.execute(function(resp) {
          var calendars = resp.items;
          for (var i = 0; i < calendars.length; i++) {
            if (calendars[i].summary === namespace) {
              _calendarId = calendars[i].id;
              _calendar = calendars[i];
              return resolve(_calendarId);
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
          'summary': namespace
        });

        request.execute(function(resp) {
          _calendarId = resp.id;
          _calendar = resp;
          return resolve(_calendarId);
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
          _events = resp.items;
          resolve(_events);
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

    this.checkAuth = function() {
      return checkAuth()
      .then(loadCalendarApi)
      .then(getCalendar)
      .then(getEvents)
      .then(parseEvents);
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
          'calendarId': _calendarId
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
          'calendarId': _calendarId,
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
          'calendarId': _calendarId,
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
          'calendarId': _calendarId
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