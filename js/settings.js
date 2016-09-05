/* jshint unused:false */
const version = '0.3';
const namespace = 'periodTracker';

const gcalClientId = '264231513776-rbc9gpga3hsi244dodlt96crcmf99141.apps.googleusercontent.com';
const gcalScopes = ['https://www.googleapis.com/auth/calendar'];
const gcalTitle = 'Period Tracker';
const gcalOnload = 'gapiOnload';

var defaultSettings = {
  startDayOfWeek: 1, // 0 Sunday, 1 Monday
  showExtendedMonth: false,
  periodLength: 4,
  cycleLength: 28
};

var features = {
  offline: false,
  gcal: true,
  sync: true
};