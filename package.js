Package.describe({
  summary: "[Mothballed] Unstyled VueJS version of login widgets for Meteor Mogul",
  version: "0.0.4",
  git: "https://github.com/meteor-mogul/meteor-accounts-vue-unstyled.git",
  name: "meteormogul:accounts-ui-unstyled"
});

Package.onUse(function (api) {
  api.use(['tracker@1.1.3', 'service-configuration@1.0.11', 'accounts-base@1.4.1',
           'underscore@1.0.10', 'templating@1.2.13', 'session@1.1.7', 'jquery@1.11.10'], 'client');
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base@1.4.1', ['client', 'server']);

  // Allow us to call Accounts.oauth.serviceNames, if there are any OAuth
  // services.
  api.use('accounts-oauth@1.1.15', {weak: true});

  // Allow us to directly test if accounts-password (which doesn't use
  // Accounts.oauth.registerService) exists.
  api.use('accounts-password@1.5.0', {weak: true});

  // Allow us to use VueJS components on the client
  api.use('meteormogul:vue-dist@2.5.15', 'client');

  api.addFiles([
    'accounts_ui.js',

    'login_buttons.html',
    'login_buttons_single.html',
    'login_buttons_dropdown.html',
    'login_buttons_dialogs.html',

    'login_buttons_session.js',

    'login_buttons.js',
    'login_buttons_single.js',
    'login_buttons_dropdown.js',
    'login_buttons_dialogs.js'], 'client');

  // The less source defining the default style for accounts-ui. Just adding
  // this package doesn't actually apply these styles; they need to be
  // `@import`ed from some non-import less file.  The accounts-ui package does
  // that for you, or you can do it in your app.
  api.use('less@2.7.11');
  api.addFiles('login_buttons.import.less');
});

Package.onTest(function (api) {
  api.use('accounts-ui-unstyled');
  api.use('tinytest@1.0.12');
  api.addFiles('accounts_ui_tests.js', 'client');
});
