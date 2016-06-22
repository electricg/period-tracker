/* global gapi, moment */
(function(window) {
  'use strict';

  var Gcal = function(CLIENT_ID, SCOPES, namespace) {
    var _self = this;

    var _timezone = moment().format('Z');
    var _calendarId = '';
    var _calendar;
    var _events;

    /**
     * Check if current user has authorized this application
     * @param {function} callback
     */
    this.checkAuth = function(callback) {
      gapi.auth.authorize(
        {
          'client_id': CLIENT_ID,
          'scope': SCOPES.join(' '),
          'immediate': true
        }, function(authResult) {
          handleAuthResult(authResult, callback);
        });
    };

    /**
     * Handle response from authorization server.
     * @param {object} authResult Authorization result
     * @param {function} callback
     */
    var handleAuthResult = function(authResult, callback) {
      if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        console.log('authorized');
        _self.loadCalendarApi(callback);
      } else {
        // Show auth UI, allowing the user to initiate authorization by clicking authorize button.
        console.log('not authorized');
      }
    };

    /**
     * Initiate auth flow in response to user authorize action
     */
    // var handleAuthAction = function() {
    //   gapi.auth.authorize(
    //     {
    //       'client_id': CLIENT_ID,
    //       'scope': SCOPES,
    //       'immediate': false
    //     }, handleAuthResult);
    //   return false;
    // };

    /**
     * Load Google Calendar client library
     * @param {function} callback
     */
    this.loadCalendarApi = function(callback) {
      gapi.client.load('calendar', 'v3', function() {
        getCalendar(callback);
      });
    };

    /**
     * Get calendar
     * @param {function} callback
     */
    var getCalendar = function(callback) {
      var request = gapi.client.calendar.calendarList.list();
      
      request.execute(function(resp) {
        var calendars = resp.items;
        for (var i = 0; i < calendars.length; i++) {
          if (calendars[i].summary === namespace) {
            _calendarId = calendars[i].id;
            _calendar = calendars[i];
            getEvents(_calendarId, callback);
            return;
          }
        }

        if (!_calendarId) {
          createCalendar(callback);
        }
      });
    };

    /**
     * Create calendar
     * @param {function} callback
     */
    var createCalendar = function(callback) {
      var request = gapi.client.calendar.calendars.insert({
        'summary': namespace
      });

      request.execute(function(resp) {
        _calendarId = resp.id;
        _calendar = resp;
        getEvents(_calendarId, callback);
      });
    };

    /**
     * Get events from calendar
     * @param {string} id
     * @param {function} callback
     */
    var getEvents = function(id, callback) {
      var request = gapi.client.calendar.events.list({
        'calendarId': id,
        'singleEvents': true,
        'orderBy': 'startTime',
        'showDeleted': true
      });

      request.execute(function(resp) {
        _events = resp.items;
        parseEvents(_events, callback);
      });
    };

    /**
     * Parse downloaded data into our standard
     * @param {object} data
     * @param {function} callback
     */
    var parseEvents = function(data, callback) {
      var parsedData = [];

      data.forEach(function(item) {
        parsedData.push({
          id: item.summary,
          date: item.start.dateTime || item.start.date,
          created: item.created,
          updated: item.updated,
          active: item.status === 'cancelled' ? false : true
        });
      });

      callback(parsedData);
    };

    /**
     * Create an event
     * @param {object} data
     * @param {function} callback
     */
    this.add = function(data, callback) {
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