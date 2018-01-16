# Changelog for Meteor Mogul meteor-accounts-vue-unstyled

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
