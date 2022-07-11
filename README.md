# Period Tracker

Live demo [https://electricg.github.io/period-tracker/](https://electricg.github.io/period-tracker/)

## Why

- I wanted to play with some of the cool new browser API (service workers, add to home screen, background sync, etc...)
- I wanted a light app that does exactly what I need with only a couple of tap
- I wanted the data to be easy to backup and retrieve (using Google Calendar)

## Features

- Work offline using service worker [more info](http://www.html5rocks.com/en/tutorials/service-worker/introduction/)
- Add to Home screen [more info](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)

#### TODO

- [x] service worker - work offline
- [ ] when during event, different homescreen
- [x] implement edit entry UI functionality
- [x] add share to app functionality
- [x] add export data as text to app functionality
- [x] better sw (with the "new update, refresh")
- [x] show export data functionality only if supported
- [ ] verify how the storage works with the shared sub domain
- [x] use <time datetime="YYYY-MM-DD"> tag
- [ ] add legend to calendar
- [ ] add navigation by year, and back to today, in calendar
- [ ] dark mode
- [ ] update moment library
- [ ] custom splash screen
- [ ] manifest doesn't have a maskable icon
- [ ] add functionality to clear/update sw cache from the app ui
