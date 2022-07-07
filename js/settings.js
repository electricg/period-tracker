/* jshint unused:false */
'use strict';

const VERSION = '0.7';
const NAMESPACE = 'periodTracker';

const DEFAULT_USER_SETTINGS = {
  startDayOfWeek: 1, // 0 Sunday, 1 Monday
  showExtendedMonth: false,
  periodLength: 4,
  cycleLength: 28,
};

const FEATURES = {
  offline: false,
};

Object.freeze(DEFAULT_USER_SETTINGS);
Object.freeze(FEATURES);
