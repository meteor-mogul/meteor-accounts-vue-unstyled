import { Vue } from 'meteor/meteormogul:vue-dist';
// Allow Vue to see Meteor reactive data
import VueMeteorTracker from 'vue-meteor-tracker';
Vue.use(VueMeteorTracker);
import { MMDEBUG } from './main.js';

MMDEBUG && console.log("Running meteormogul:accounts-vue-unstyled/login_buttons_single.js");

// for convenience
var loginButtonsSession = Accounts._loginButtonsSession;

// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js
var capitalize = function(str){
  str = str == null ? '' : String(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
};

var loginResultCallback = function (serviceName, err) {
  if (!err) {
    loginButtonsSession.closeDropdown();
  } else if (err instanceof Accounts.LoginCancelledError) {
    // do nothing
  } else if (err instanceof ServiceConfiguration.ConfigError) {
    if (Template._configureLoginServiceDialog.templateForService(serviceName)) {
      loginButtonsSession.configureService(serviceName);
    } else {
      loginButtonsSession.errorMessage(
        "No configuration for " + capitalize(serviceName) + ".\n" +
        "Use `ServiceConfiguration` to configure it or " +
        "install the `" +serviceName + "-config-ui` package."
      );
    }
  } else {
    loginButtonsSession.errorMessage(err.reason || "Unknown error");
  }
};


// In the login redirect flow, we'll have the result of the login
// attempt at page load time when we're redirected back to the
// application.  Register a callback to update the UI (i.e. to close
// the dialog on a successful login or display the error on a failed
// login).
//
Accounts.onPageLoadLogin(function (attemptInfo) {
  // Ignore if we have a left over login attempt for a service that is no longer registered.
  if (_.contains(_.pluck(getLoginServices(), "name"), attemptInfo.type))
    loginResultCallback(attemptInfo.type, attemptInfo.error);
});

var _vueLoggingInSingleLoginButton = Vue.component('login-buttons-logging-in-single-login-button',
  {
    name: 'login-buttons-logging-in-single-login-button',
    template: '#login-buttons-logging-in-single-login-button-template'
  }
);

var _vueLoggedOutSingleLoginButton = Vue.component('login-buttons-logged-out-single-login-button',
  {
    name: 'login-buttons-logged-out-single-login-button',
    template: '#login-buttons-logged-out-single-login-button-template',
    data: function () {
      return {
        cannotConfigure: false,
        configured: false,
        capitalizedName: null
      };
    },
    props: ['name'],
    meteor: {
      cannotConfigure: {
        update() {
          return !ServiceConfiguration.configurations.findOne({service: this.name})
            && !Template._configureLoginServiceDialog.templateForService(this.name);
        }
      },
      configured: {
        update() {
          return !!ServiceConfiguration.configurations.findOne({service: this.name});
        }
      },
      capitalizedName: {
        update() {
          if (name === 'github')
            // XXX we should allow service packages to set their capitalized name
            return 'GitHub';
          else if (name === 'meteor-developer')
            return 'Meteor';
          else
            return capitalize(name);
          }
      }
    },
    methods: {
      login: function () {
        var serviceName = this.name;
        loginButtonsSession.resetMessages();

        // XXX Service providers should be able to specify their
        // `Meteor.loginWithX` method name.
        var loginWithService = Meteor["loginWith" +
                                      (serviceName === 'meteor-developer' ?
                                       'MeteorDeveloperAccount' :
                                       capitalize(serviceName))];

        var options = {}; // use default scope unless specified
        if (Accounts.ui._options.requestPermissions[serviceName])
          options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
        if (Accounts.ui._options.requestOfflineToken[serviceName])
          options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
        if (Accounts.ui._options.forceApprovalPrompt[serviceName])
          options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];

        loginWithService(options, function (err) {
          loginResultCallback(serviceName, err);
        });
      }
    }
  }
);

/*
Template._loginButtonsLoggedOutSingleLoginButton.events({
  'click .login-button': function () {
    var serviceName = this.name;
    loginButtonsSession.resetMessages();

    // XXX Service providers should be able to specify their
    // `Meteor.loginWithX` method name.
    var loginWithService = Meteor["loginWith" +
                                  (serviceName === 'meteor-developer' ?
                                   'MeteorDeveloperAccount' :
                                   capitalize(serviceName))];

    var options = {}; // use default scope unless specified
    if (Accounts.ui._options.requestPermissions[serviceName])
      options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
    if (Accounts.ui._options.requestOfflineToken[serviceName])
      options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
    if (Accounts.ui._options.forceApprovalPrompt[serviceName])
      options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];

    loginWithService(options, function (err) {
      loginResultCallback(serviceName, err);
    });
  }
});

Template._loginButtonsLoggedOutSingleLoginButton.helpers({
  // not configured and has no config UI
  cannotConfigure: function() {
    return !ServiceConfiguration.configurations.findOne({service: this.name})
      && !Template._configureLoginServiceDialog.templateForService(this.name);
  },
  configured: function () {
    return !!ServiceConfiguration.configurations.findOne({service: this.name});
  },
  capitalizedName: function () {
    if (this.name === 'github')
      // XXX we should allow service packages to set their capitalized name
      return 'GitHub';
    else if (this.name === 'meteor-developer')
      return 'Meteor';
    else
      return capitalize(this.name);
  }
});
*/

export { _vueLoggedOutSingleLoginButton };
