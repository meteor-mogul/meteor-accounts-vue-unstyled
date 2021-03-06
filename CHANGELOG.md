# Changelog for Meteor Mogul meteor-accounts-vue-unstyled

## [0.0.20] - 2018-01-26

- Show error messages.

## [0.0.19] - 2018-01-26

- Worked through a merge conflict.

## [0.0.18] - 2018-01-26

- More forward progress!
- displayName when logged in.
- Got login and logout working.  Whew!

## [0.0.17] - 2018-02-21

- Note that this is a work in progress.

## [0.0.16] - 2018-01-18

- Even more progress.
- Figured out v-bind on HTML attributes.
- Playing nicely with meteor-accounts-vue so looks good.

## [0.0.15] - 2018-01-17

- More progress.
- Still no joy with the import / export business between package and app.
- But reactivity seems to be working.
- Almost all templates re-written in Vue.  Now wiring up methods.
- Stuck right now on how to interpolate with Vue into HTML attributes.

## [0.0.14] - 2018-01-17

- Bump package version #

## [0.0.13] - 2018-01-17

- Added debugging, moving things around.

## [0.0.12] - 2018-01-16

- Making more progress.

## [0.0.11] - 2018-01-16

- Seems to work in concept.  Now for the hard part...

## [0.0.10] - 2018-01-16

- Check to make sure reactivity is actually working...

## [0.0.9] - 2018-01-16

- Require npm package `vue-meteor-tracker': '1.2.3'`
- That lets Vue see Meteor reactive data
- Maybe this is sort of starting to work?  Slow going.

## [0.0.8] - 2018-01-15

- Use static-html to parse .html files
- Comment out Template code
- Start converting from Blaze to Vue

## [0.0.7] - 2018-01-15

- Giving up on export / import business and just declaring global variable for LoginButtons

## [0.0.6] - 2018-01-15

- Sorted out package.js api.addFiles() vs. api.mainModule() debacle

## [0.0.5] - 2018-01-10

### Changed

* Bumped semver to force use of updated package

## [0.0.4] - 2018-01-10

### Added

* Export LoginButtons Vue component

### Changed

* Change name of package to `accounts-vue-unstyled`
* `master` branch now calling package `accounts-vue-unstyled`
* Use `meteormogul:vue-dist@2.5.15` which exports Vue symbol

## 0.0.3 - (2018-01-03)

### Changed

* Fixed typo in Vue component.

## 0.0.2 - (2018-01-03)

### Changed

* Added versions to packages required by this one.

## 0.0.1 - (2018-01-03)

### Changed

* Published to Atmosphere as meteormogul:accounts-ui-unstyled
* First attempt at VueJS component for loginButtons
