/* jshint unused:false */
/* eslint no-unused-vars: "off" */
'use strict';

const VERSION = '0.11.1';
const NAMESPACE = 'periodTracker';

const DEFAULT_USER_SETTINGS = {
  startDayOfWeek: 1, // 0 Sunday, 1 Monday, 6 Saturday
  showExtendedMonth: false,
  periodLength: 4,
  cycleLength: 28,
};

const FEATURES = {
  offline: false,
};

const FILE = {
  name: 'period-tracker_${now}.txt',
  title: 'Period Tracker Backup ${now}',
};

Object.freeze(DEFAULT_USER_SETTINGS);
Object.freeze(FEATURES);
Object.freeze(FILE);
