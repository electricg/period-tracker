/* global gapi */
/* exported checkAuth, handleAuthAction, addEventApi */

var CLIENT_ID = '264231513776-rbc9gpga3hsi244dodlt96crcmf99141.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var calendarId = '';

/**
 * Check if current user has authorized this application.
 */
var checkAuth = function() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
};

/**
 * Handle response from authorization server.
 * @param {object} authResult Authorization result
 */
var handleAuthResult = function(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadCalendarApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
};

/**
 * Initiate auth flow in response to user authorize action
 */
var handleAuthAction = function() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES,
      'immediate': false
    }, handleAuthResult);
  return false;
};

/**
 * Load Google Calendar client library. List events once client library is loaded.
 */
var loadCalendarApi = function() {
  gapi.client.load('calendar', 'v3', listEvents);
};

var listEvents = function() {
  var requestCalendarsList = gapi.client.calendar.calendarList.list();
  
  requestCalendarsList.execute(function(resp) {
    var calendars = resp.items;
    for (var i = 0; i < calendars.length; i++) {
      if (calendars[i].summary === 'Period Tracker') {
        calendarId = calendars[i].id;
        break;
      }
    }

    if (calendarId) {
      var requestEventsList = gapi.client.calendar.events.list({
        'calendarId': calendarId,
        'singleEvents': true,
        'orderBy': 'startTime',
        'showDeleted': true
      });

      requestEventsList.execute(function(resp) {
        console.log(resp.items);
      });
    }
  });
};

var addEventApi = function() {
  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.events.insert({
      'calendarId': calendarId
    }, {
      start: {
        dateTime: '2016-06-08T14:00:00+01:00'
      },
      end: {
        dateTime: '2016-06-08T15:30:00+01:00'
      },
      summary: 'Automatically created by PT'
    });

    request.execute(function(resp) {
      console.log(resp);
    });
  });
};