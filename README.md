# Period Tracker

Live demo [https://electricg.github.io/period-tracker/](https://electricg.github.io/period-tracker/)

## Why

- I wanted to play with some of the cool new browser API (service workers, add to home screen, background sync, etc...)
- I wanted a light app that does exactly what I need with only a couple of tap
- I wanted the data to be easy to backup and retrieve

## Features

- Work offline using service worker [more info](http://www.html5rocks.com/en/tutorials/service-worker/introduction/)
- Add to Home screen [more info](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)
- Export to and import from file
- Share data to other apps

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
- [x] add navigation by year, and back to today, in calendar
- [ ] dark mode
- [x] update moment library
- [x] custom splash screen
- [x] manifest doesn't have a maskable icon
- [ ] add functionality to clear/update sw cache from the app ui
- [x] bug when I'm at day 0 and it doesn't show as future
- [ ] try web components
- [ ] import data from other apps
  - [ ] app that I use
- [ ] use more modern css
- [ ] show fertility and ovulation days
- [ ] add swipe left and right in the calendar page to navigate prev/next months
- [ ] add tests
- [ ] replace svg icons in log with emojis
- [ ] add the auto patch versioning on commit

## Dev notes

### Local dev

Run either `python -m http.server 8080` or `http-server` (see below).

package.json is only for eslint.

### HTTPS in local dev

From https://web.dev/how-to-use-local-https/

1. Install mkcert `brew install mkcert`
1. Add mkcert to your local root CAs `mkcert -install`
1. Navigate to your site's root directory `cd Sites/electricg/`
1. Generate a certificate for your site `mkcert giulia.local`
1. Install [http-server
   ](https://www.npmjs.com/package/http-server) `brew install http-server`
1. Start the server `http-server -S -C giulia.local.pem -K giulia.local-key.pem -a giulia.local`

### Logo

Originally from https://hawcons.com/, got it via https://icomoon.io/.

#### Favicon generator

https://realfavicongenerator.net/

- Favicon for Android Chrome
  - Apply a slight drop shadow, similar to official Google apps (Gmail, Play Store, YouTube...)
- Windows Metro
  - Dark Blue
- macOS Safari
  - Theme color: #0099ff

### Icons

From https://icomoon.io/.
