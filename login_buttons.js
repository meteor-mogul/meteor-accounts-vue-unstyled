import { Vue } from 'meteor/meteormogul:vue-dist';
// Okay, big problem with re-writing accounts system is that Meteor's
// reactivity is invisible to Vue, and vice versa.
// Vue doesn't get notified when Tracker reactive values change.
// This is a problem for things like Meteor.user(), Meteor.loggingIn()
// and Accounts.loginServicesConfigured().
// For a discussion of the issues, see
// https://github.com/meteor-vue/vue-meteor-tracker/issues/3
// Solution is to require npm package 'vue-meteor-tracker'
// This allows Vue to see Meteor reactive data.
import VueMeteorTracker from 'vue-meteor-tracker';
Vue.use(VueMeteorTracker);

import { Accounts } from 'meteor/accounts-base';

// Use symbols from other files
import { _vueLoggedOutDropdown } from './login_buttons_dropdown.js';
import { _vueLoggedOutSingleLoginButton } from './login_buttons_single.js';
import { MMDEBUG } from './main.js';
MMDEBUG && console.log("Running meteormogul:accounts-vue-unstyled/login_buttons.js");

// for convenience
var loginButtonsSession = Accounts._loginButtonsSession;

hasPasswordService = function () {
  return !!Package['accounts-password'];
};

// returns an array of the login services used by this app. each
// element of the array is an object (eg {name: 'facebook'}), since
// that makes it useful in combination with handlebars {{#each}}.
//
// don't cache the output of this function: if called during startup (before
// oauth packages load) it might not include them all.
//
// NOTE: It is very important to have this return password last
// because of the way we render the different providers in
// login_buttons_dropdown.html
getLoginServices = function () {
  var self = this;

  // First look for OAuth services.
  var services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];

  // Be equally kind to all login services. This also preserves
  // backwards-compatibility. (But maybe order should be
  // configurable?)
  services.sort();

  // Add password, if it's there; it must come last.
  if (hasPasswordService())
    services.push('password');

  return _.map(services, function(name) {
    return {name: name};
  });
};

dropdown = function () {
  return hasPasswordService() || getLoginServices().length > 1;
};

// Vue components that provide the ui for the accounts system

// _vueLoginButtons displays login buttons
// declare as a global so I don't have to worry about imports
_vueLoginButtons = Vue.component('login-buttons',
  {
    name: 'login-buttons',
    template: '#login-buttons-template',
    // See later under meteor where all these data symbols get access to
    // Meteor reactivity.  When Tracker notices a change in their values,
    // it will notify Vue that the value has updated.
    data: function() {
      return {
        dropdownAlignClass: `login-buttons-dropdown-align-${this.align}`,
        currentUser: null,
        configurationLoaded: false,
        loggingInOrOut: false,
        dropdownStatus: false,
        loginServices: 0
      };
    },
    // Let Vue see Meteor reactive data
    meteor: {
      currentUser: {
        update() {
          // Meteor.user() is reactive
          return Meteor.user();
        }
      },
      configurationLoaded: {
        update() {
          // This is a reactive function that will change to
          // true when the login services have been configured
          return Accounts.loginServicesConfigured();
        }
      },
      dropdownStatus: {
        update() {
          return dropdown();
        }
      },
      loginServices: {
        update() {
          return getLoginServices().length;
        }
      }
    },
    props: {
        align: {
          type: String,
          default: 'left'
        }
    }
  }
);

var _vueOnlyOne = Vue.component('login-buttons-only-one',
{
    name: 'login-buttons-only-one',
    template: '#login-buttons-with-only-one-button-template',
    data: function () {
      return {
        loggingIn: function () {
          return Meteor.loggingIn();
        }
      }
    }
  }
);

var _vueLoggedOutPasswordServiceSeparator = Vue.component('login-buttons-logged-out-password-service-separator',
{
  name: 'login-buttons-logged-out-password-service-separator',
  template: '#login-buttons-logged-out-password-service-separator-template'
}
);

var _vueLoggedOutAllServices = Vue.component('login-buttons-logged-out-all-services',
{
  name: 'login-buttons-logged-out-all-services',
  template: '#login-buttons-logged-out-all-services-template',
  data: function () {
    return {
      services: getLoginServices(),
      hasPasswordService: hasPasswordService(),
      hasOtherServices: getLoginServices().length > 1
    }
  },
  methods: {
    isPasswordService: function (service) {
      MMDEBUG && console.log('service:', service);
      return service.name === 'password';
    }
  }
});

var _vueLoggedOutSelector = Vue.component('login-buttons-logged-out-selector',
  {
    name: 'login-buttons-logged-out-selector',
    functional: true,
    props: [ 'dropdownStatus' ],
    render: function (createElement, context) {

      MMDEBUG && console.log('rendering _vueLoggedOutSelector');
      MMDEBUG && console.log('dropdownStatus:', context.props.dropdownStatus);
      MMDEBUG && console.log('loggingIn:', Meteor.loggingIn());

      function selectComponent() {
        if (context.props.dropdownStatus) {
          return _vueLoggedOutDropdown;
        } else {
          // Only one button
          return _vueOnlyOne;
        }
      }

      return createElement(
        selectComponent(),
        context.data,
        context.children
      );
    }
  }
);

var _vueLoggedOutWithServices = {
  name: 'logged-out-with-services',
  template: "#login-buttons-logged-out-template",
  data: function () {
    return {
      configurationLoaded: false,
      dropdownStatus: false,
      loggingIn: false
    }
  },
  // Let Vue see Meteor reactive data
  meteor: {
    configurationLoaded: {
      update() {
        // This is a reactive function that will change to
        // true when the login services have been configured
        return Accounts.loginServicesConfigured();
      }
    },
    loggingIn: {
      update() {
        // This is a reactive function that will change to
        // true when a user is logging in
        return Meteor.loggingIn();
      }
    },
    dropdownStatus: {
      update() {
        return dropdown();
      }
    }
  }
};

var _vueLoggedOutNoServices = Vue.component('logged-out-no-service',
{
  name: 'logged-out-no-services',
  template: "#no-login-services-template"
}
);

var _vueLoggingIn = Vue.component('login-buttons-logging-in',
{
  name: 'login-buttons-logging-in',
  template: "#login-buttons-logging-in-template"
}
);

var _vueLoggingInSingleLoginButton = Vue.component('login-buttons-logging-in-single-button',
{
  name: 'login-buttons-logging-in-single-button',
  template: "#login-buttons-logging-in-single-button-template"
}
);

var _vueLoggedInSingle = Vue.component('login-buttons-logged-in-single-logout',
{
    name: 'login-buttons-logged-in-single-logout',
    template: "#login-buttons-logged-in-single-logout-template",
    data: function () {
      return {
        displayName: displayName()
      }
    }
}
);

var _vueLoggedIn = Vue.component('login-buttons-logged-in',
{
  name: 'login-buttons-logged-in',
  template: "#login-buttons-logged-in-template",
  data: function () {
    return {
      dropdownStatus: dropdown()
    }
  }
}
);

var _vueLoggedInSelector = Vue.component('login-buttons-logged-in-selector',
{
  name: 'login-buttons-logged-in-selector',
  functional: true,
  props: ['currentUser',
          'loggingInOrOut',
          'dropdownStatus'],
  render: function (createElement, context) {

    MMDEBUG && console.log('rendering _vueLoggedInSelector');
    MMDEBUG && console.log('currentUser:', context.props.currentUser);
    MMDEBUG && console.log('loggingInOrOut:', context.props.loggingInOrOut);
    MMDEBUG && console.log('dropdownStatus:', context.props.dropdownStatus);

    function selectComponent(loggingInOrOut,dropdownStatus) {
      MMDEBUG && console.log('Selecting component for _vueLoggedInSelector');
      if (loggingInOrOut) {
        /*
        We aren't actually logged in/out yet; we're just setting Meteor.userId
        optimistically during an at-startup login-with-token. We expose this
        state so other UIs can treat it specially, but we'll just treat it
        as logged out.
        */

        if (dropdownStatus) {
          MMDEBUG && console.log("returning _vueLoggedInDropdown");
          return _vueLoggedInDropdown;
        } else {
          MMDEBUG && console.log("returning _vueLoggedInSingle");
          return _vueLoggedInSingle;
        }
      } else {
        // We're already logged in.
        MMDEBUG && console.log("returning _vueLoggedIn", _vueLoggedIn);
        return _vueLoggedIn;
      }
    }

    MMDEBUG && console.log("creating element for _vueLoggedInSelector");
    return createElement(
      selectComponent(context.props.loggingInOrOut,
                      context.props.dropDownStatus),
      context.data,
      context.children
    );
  }
}
);

// _vueLoginButtonsSelector is a functional Vue component that selects which
// template to display based on Meteor.user() and getLoginServices()
var _vueLoginButtonsSelector = Vue.component('login-buttons-selector',
  {
    name: 'login-buttons-selector',
    functional: true,
    props: [ 'currentUser',
             'loggingInOrOut',
             'dropdownStatus',
             'loginServices' ],
    render: function (createElement, context) {

      MMDEBUG && console.log('rendering _vueLoginButtonsSelector');
      MMDEBUG && console.log('currentUser:', context.props.currentUser);
      MMDEBUG && console.log('dropdownStatus:', context.props.dropdownStatus);
      MMDEBUG && console.log('getLoginServices:', context.props.loginServices);
      MMDEBUG && console.log('context.data:', context.data);
      MMDEBUG && console.log('context.props:', context.props);

      function selectComponent(currentUser,loginServices) {
        if (currentUser) {
          // We're already logged in.  Figure out how to logout.
          return _vueLoggedInSelector;
        } else {
          // Check to see if we have any login services
          if (loginServices) {
            // Yes, we have login services.
            return _vueLoggedOutWithServices;
          } else {
            // No, we have no login services today.
            return _vueLoggedOutNoServices;
          }
        }
      }

      return createElement(
        selectComponent(context.props.currentUser,context.props.loginServices),
        {
          // I must be missing something.  This can't be the way to
          // pass down props...
          attrs: {
            currentUser: context.props.currentUser,
            loggingInOrOut: context.props.loggingInOrOut,
            dropdownStatus: context.props.dropdownStatus,
            loginServices: context.props.loginServices
          }
        },
        context.children
      );
    }
  }
);

var _vueMessages = Vue.component('login-buttons-messages',
{
  name: 'login-buttons-messages',
  template: '#login-buttons-messages-template',
  props: ['errorMessage','infoMessage']
}
);

/*
// shared between dropdown and single mode
Template.loginButtons.events({
  'click #login-buttons-logout': function() {
    Meteor.logout(function () {
      loginButtonsSession.closeDropdown();
    });
  }
});

Template.registerHelper('loginButtons', function () {
  throw new Error("Use {{> loginButtons}} instead of {{loginButtons}}");
});
*/

//
// helpers
//

displayName = function () {
  var user = Meteor.user();
  if (!user)
    return '';

  if (user.profile && user.profile.name)
    return user.profile.name;
  if (user.username)
    return user.username;
  if (user.emails && user.emails[0] && user.emails[0].address)
    return user.emails[0].address;

  return '';
};

// XXX improve these. should this be in accounts-password instead?
//
// XXX these will become configurable, and will be validated on
// the server as well.
validateUsername = function (username) {
  if (username.length >= 3) {
    return true;
  } else {
    loginButtonsSession.errorMessage("Username must be at least 3 characters long");
    return false;
  }
};
validateEmail = function (email) {
  if (passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === '')
    return true;

  if (email.indexOf('@') !== -1) {
    return true;
  } else {
    loginButtonsSession.errorMessage("Invalid email");
    return false;
  }
};
validatePassword = function (password) {
  if (password.length >= 6) {
    return true;
  } else {
    loginButtonsSession.errorMessage("Password must be at least 6 characters long");
    return false;
  }
};

/*
//
// loginButtonLoggedOut template
//

Template._loginButtonsLoggedOut.helpers({
  dropdown: dropdown,
  services: getLoginServices,
  singleService: function () {
    var services = getLoginServices();
    if (services.length !== 1)
      throw new Error(
        "Shouldn't be rendering this template with more than one configured service");
    return services[0];
  },
  configurationLoaded: function () {
    return Accounts.loginServicesConfigured();
  }
});


//
// loginButtonsLoggedIn template
//

  // decide whether we should show a dropdown rather than a row of
  // buttons
Template._loginButtonsLoggedIn.helpers({
  dropdown: dropdown
});



//
// loginButtonsLoggedInSingleLogoutButton template
//

Template._loginButtonsLoggedInSingleLogoutButton.helpers({
  displayName: displayName
});



//
// loginButtonsMessage template
//

Template._loginButtonsMessages.helpers({
  errorMessage: function () {
    return loginButtonsSession.get('errorMessage');
  }
});

Template._loginButtonsMessages.helpers({
  infoMessage: function () {
    return loginButtonsSession.get('infoMessage');
  }
});


//
// loginButtonsLoggingInPadding template
//

Template._loginButtonsLoggingInPadding.helpers({
  dropdown: dropdown
});
*/

export { _vueLoginButtons, displayName };
