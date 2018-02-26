import { Vue } from 'meteor/meteormogul:vue-dist';
import VueMeteorTracker from 'vue-meteor-tracker';
Vue.use(VueMeteorTracker);

import { MMDEBUG } from './main.js';
import { displayName } from './login_buttons.js';
MMDEBUG && console.log("Running meteormogul:accounts-vue-unstyled/login_buttons_dropdown.js");

// for convenience
var loginButtonsSession = Accounts._loginButtonsSession;

var _vueLoggedInDropdown = Vue.component('login-buttons-logged-in-dropdown',
{
    name: 'login-buttons-logged-in-dropdown',
    template: "#login-buttons-logged-in-dropdown-template",
    data: function () {
      return {
        displayName: null,
        dropdownVisible: false,
        inMessageOnlyFlow: false,
        inChangePasswordFlow: false
      }
    },
    meteor: {
        displayName: {
          update () {
            return displayName();
          }
        },
        dropdownVisible: {
          update() {
            return loginButtonsSession.get('dropdownVisible');
          }
        },
        inMessageOnlyFlow: {
          update() {
            return loginButtonsSession.get('inMessageOnlyFlow');
          }
        },
        inChangePasswordFlow: {
          update() {
            return loginButtonsSession.get('inChangePasswordFlow');
          }
        }
    },
    methods: {
      showDropdown: function () {
<<<<<<< HEAD
        MMDEBUG && console.log('showDropdown');
        loginButtonsSession.set('dropdownVisible', true);
      },
      hideDropdown: function () {
        MMDEBUG && console.log('closeDropdown');
=======
        loginButtonsSession.set('dropdownVisible', true);
      },
      hideDropdown: function() {
>>>>>>> 1535cac5f7e9078f14c2a06dd6b7ef773901d607
        loginButtonsSession.closeDropdown();
      }
    }
}
);

var _vueLoggedInDropdownActions = Vue.component('login-buttons-logged-in-dropdown-actions',
  {
    name: 'login-buttons-logged-in-dropdown-actions',
    template: '#login-buttons-logged-in-dropdown-actions-template',
    data: function () {
      return {
        allowChangingPassword: false,
      }
    },
    meteor: {
      allowChangingPassword: {
        update() {
          // it would be more correct to check whether the user has a password set,
          // but in order to do that we'd have to send more data down to the client,
          // and it'd be preferable not to send down the entire service.password document.
          //
          // instead we use the heuristic: if the user has a username or email set.
          var user = Meteor.user();
          return user.username || (user.emails && user.emails[0] && user.emails[0].address);
        }
      }
    },
    methods: {
      changePassword: function () {
        loginButtonsSession.resetMessages();
        loginButtonsSession.set('inChangePasswordFlow', true);
      },
      logout: function () {
        Meteor.logout(function () { loginButtonsSession.closeDropdown(); });
      }
    }
  }
);

var _vueLoggedOutDropdown = Vue.component('login-buttons-logged-out-dropdown',
  {
    name: 'login-buttons-logged-out-dropdown',
    template: '#login-buttons-logged-out-dropdown-template',
    data: function () {
      return {
        dropdownVisible: false,
        loggingIn: false
      };
    },
    meteor: {
      loggingIn: {
        update() {
          return Meteor.loggingIn();
        }
      },
      dropdownVisible: {
        update() {
          return loginButtonsSession.get('dropdownVisible');
        }
      }
    },
    methods: {
      showDropdown: function () {
        MMDEBUG && console.log('showDropdown');
        loginButtonsSession.set('dropdownVisible', true);
      },
      hideDropdown: function () {
        MMDEBUG && console.log('closeDropdown');
        loginButtonsSession.closeDropdown();
      },
      loginLinkClass: function () {
        var additionalClasses = function () {
          if (!hasPasswordService()) {
            return '';
          } else {
            if (loginButtonsSession.get('inSignupFlow')) {
              return 'login-form-create-account';
            } else if (loginButtonsSession.get('inForgotPasswordFlow')) {
              return 'login-form-forgot-password';
            } else {
              return 'login-form-sign-in';
            }
          }
        }
        return `login-link-and-dropdown-list ${additionalClasses()}`;
      }
    }
  }
);

var _vueLoggedOutPasswordService = Vue.component('login-buttons-logged-out-password-service',
{
  name: 'login-buttons-logged-out-password-service',
  template: '#login-buttons-logged-out-password-service-template',
  data: function () {
    return {
      inForgotPasswordFlow: false,
      fields: [],
      inSignupFlow: false,
      inLoginFlow: false,
      showCreateAccountLink: false,
      showForgotPasswordLink: false
    }
  },
  meteor: {
    fields: {
      update() {
          var loginFields = [
            {fieldName: 'username-or-email', fieldLabel: 'Username or Email',
             visible: _.contains(
                 ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL"],
                 passwordSignupFields())
             },
            {fieldName: 'username', fieldLabel: 'Username',
             visible: passwordSignupFields() === "USERNAME_ONLY"
             },
            {fieldName: 'email', fieldLabel: 'Email', inputType: 'email',
             visible: passwordSignupFields() === "EMAIL_ONLY"
             },
            {fieldName: 'password', fieldLabel: 'Password', inputType: 'password',
             visible: true
             }
          ];

          var signupFields = [
            {fieldName: 'username', fieldLabel: 'Username',
             visible: _.contains(
                 ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],
                 passwordSignupFields())
             },
            {fieldName: 'email', fieldLabel: 'Email', inputType: 'email',
             visible: _.contains(
                 ["USERNAME_AND_EMAIL", "EMAIL_ONLY"],
                 passwordSignupFields())
             },
            {fieldName: 'email', fieldLabel: 'Email (optional)', inputType: 'email',
             visible: passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL"
             },
            {fieldName: 'password', fieldLabel: 'Password', inputType: 'password',
             visible: true
             },
            {fieldName: 'password-again', fieldLabel: 'Password (again)',
             inputType: 'password',
             // No need to make users double-enter their password if
             // they'll necessarily have an email set, since they can use
             // the "forgot password" flow.
             visible: _.contains(
                 ["USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],
                 passwordSignupFields())
             }
          ];

          return loginButtonsSession.get('inSignupFlow') ? signupFields : loginFields;
      }
    },
    inForgotPasswordFlow: {
      update() {
        return loginButtonsSession.get('inForgotPasswordFlow');
      }
    },
    inLoginFlow: {
      update() {
        return !loginButtonsSession.get('inSignupFlow') && !loginButtonsSession.get('inForgotPasswordFlow');
      }
    },
    inSignupFlow: {
      update() {
        return loginButtonsSession.get('inSignupFlow');
      }
    },
    showCreateAccountLink: {
      update() {
        return !Accounts._options.forbidClientAccountCreation;
      }
    },
    showForgotPasswordLink: {
      update() {
        return _.contains(
          ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "EMAIL_ONLY"],
          passwordSignupFields());
      }
    }
  },
  methods: {
    createAccount: function () {
      loginButtonsSession.resetMessages();

      // store values of fields before swtiching to the signup form
      var username = trimmedElementValueById('login-username');
      var email = trimmedElementValueById('login-email');
      var usernameOrEmail = trimmedElementValueById('login-username-or-email');
      // notably not trimmed. a password could (?) start or end with a space
      var password = elementValueById('login-password');

      loginButtonsSession.set('inSignupFlow', true);
      loginButtonsSession.set('inForgotPasswordFlow', false);
      // force the ui to update so that we have the approprate fields to fill in
      Tracker.flush();

      // update new fields with appropriate defaults
      if (username !== null)
        document.getElementById('login-username').value = username;
      else if (email !== null)
        document.getElementById('login-email').value = email;
      else if (usernameOrEmail !== null)
        if (usernameOrEmail.indexOf('@') === -1)
          document.getElementById('login-username').value = usernameOrEmail;
      else
        document.getElementById('login-email').value = usernameOrEmail;

      if (password !== null)
        document.getElementById('login-password').value = password;

      // Force redrawing the `login-dropdown-list` element because of
      // a bizarre Chrome bug in which part of the DIV is not redrawn
      // in case you had tried to unsuccessfully log in before
      // switching to the signup form.
      //
      // Found tip on how to force a redraw on
      // http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes/3485654#3485654
      var redraw = document.getElementById('login-dropdown-list');
      redraw.style.display = 'none';
      redraw.offsetHeight; // it seems that this line does nothing but is necessary for the redraw to work
      redraw.style.display = 'block';
    },
    login: function () {
      MMDEBUG && console.log("logging in...");
      loginOrSignup();
    }
  }
}
);

var _vueForgotPasswordForm = Vue.component('forgot-password-form',
{
  name: 'forgot-password-form',
  template: '#forgot-password-form-template'
}
);

var _vueBackToLoginLink = Vue.component('login-buttons-back-to-login-link',
{
  name: 'login-buttons-back-to-login-link',
  template: '#login-buttons-back-to-login-link-template',
  methods: {
    login: function () {
      MMDEBUG && console.log("logging in...");
      return;
      loginButtonsSession.resetMessages();

      var username = trimmedElementValueById('login-username');
      var email = trimmedElementValueById('login-email')
            || trimmedElementValueById('forgot-password-email'); // Ughh. Standardize on names?
      // notably not trimmed. a password could (?) start or end with a space
      var password = elementValueById('login-password');

      loginButtonsSession.set('inSignupFlow', false);
      loginButtonsSession.set('inForgotPasswordFlow', false);
      // force the ui to update so that we have the approprate fields to fill in
      Tracker.flush();

      if (document.getElementById('login-username') && username !== null)
        document.getElementById('login-username').value = username;
      if (document.getElementById('login-email') && email !== null)
        document.getElementById('login-email').value = email;

      var usernameOrEmailInput = document.getElementById('login-username-or-email');
      if (usernameOrEmailInput) {
        if (email !== null)
          usernameOrEmailInput.value = email;
        if (username !== null)
          usernameOrEmailInput.value = username;
      }

      if (password !== null)
        document.getElementById('login-password').value = password;
    }
  }
}
);

var _vueChangePassword = Vue.component('login-buttons-change-password',
{
  name: 'login-buttons-change-password',
  template: '#login-buttons-change-password-template',
  data: function () {
    return {
      fields: ['one']
    };
  }
}
);


/*
//
// loginButtonsLoggedOutDropdown template and related
//

Template._loginButtonsLoggedOutDropdown.events({
  'click #login-buttons-password': function (event) {
    event.preventDefault();
    loginOrSignup();
  },

  'keypress #forgot-password-email': function (event) {
    if (event.keyCode === 13)
      forgotPassword();
  },

  'click #login-buttons-forgot-password': function () {
    forgotPassword();
  },

  'click #signup-link': function () {
    loginButtonsSession.resetMessages();

    // store values of fields before swtiching to the signup form
    var username = trimmedElementValueById('login-username');
    var email = trimmedElementValueById('login-email');
    var usernameOrEmail = trimmedElementValueById('login-username-or-email');
    // notably not trimmed. a password could (?) start or end with a space
    var password = elementValueById('login-password');

    loginButtonsSession.set('inSignupFlow', true);
    loginButtonsSession.set('inForgotPasswordFlow', false);
    // force the ui to update so that we have the approprate fields to fill in
    Tracker.flush();

    // update new fields with appropriate defaults
    if (username !== null)
      document.getElementById('login-username').value = username;
    else if (email !== null)
      document.getElementById('login-email').value = email;
    else if (usernameOrEmail !== null)
      if (usernameOrEmail.indexOf('@') === -1)
        document.getElementById('login-username').value = usernameOrEmail;
    else
      document.getElementById('login-email').value = usernameOrEmail;

    if (password !== null)
      document.getElementById('login-password').value = password;

    // Force redrawing the `login-dropdown-list` element because of
    // a bizarre Chrome bug in which part of the DIV is not redrawn
    // in case you had tried to unsuccessfully log in before
    // switching to the signup form.
    //
    // Found tip on how to force a redraw on
    // http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes/3485654#3485654
    var redraw = document.getElementById('login-dropdown-list');
    redraw.style.display = 'none';
    redraw.offsetHeight; // it seems that this line does nothing but is necessary for the redraw to work
    redraw.style.display = 'block';
  },
  'click #forgot-password-link': function () {
    loginButtonsSession.resetMessages();

    // store values of fields before swtiching to the signup form
    var email = trimmedElementValueById('login-email');
    var usernameOrEmail = trimmedElementValueById('login-username-or-email');

    loginButtonsSession.set('inSignupFlow', false);
    loginButtonsSession.set('inForgotPasswordFlow', true);
    // force the ui to update so that we have the approprate fields to fill in
    Tracker.flush();

    // update new fields with appropriate defaults
    if (email !== null)
      document.getElementById('forgot-password-email').value = email;
    else if (usernameOrEmail !== null)
      if (usernameOrEmail.indexOf('@') !== -1)
        document.getElementById('forgot-password-email').value = usernameOrEmail;

  },
  'click #back-to-login-link': function () {
    loginButtonsSession.resetMessages();

    var username = trimmedElementValueById('login-username');
    var email = trimmedElementValueById('login-email')
          || trimmedElementValueById('forgot-password-email'); // Ughh. Standardize on names?
    // notably not trimmed. a password could (?) start or end with a space
    var password = elementValueById('login-password');

    loginButtonsSession.set('inSignupFlow', false);
    loginButtonsSession.set('inForgotPasswordFlow', false);
    // force the ui to update so that we have the approprate fields to fill in
    Tracker.flush();

    if (document.getElementById('login-username') && username !== null)
      document.getElementById('login-username').value = username;
    if (document.getElementById('login-email') && email !== null)
      document.getElementById('login-email').value = email;

    var usernameOrEmailInput = document.getElementById('login-username-or-email');
    if (usernameOrEmailInput) {
      if (email !== null)
        usernameOrEmailInput.value = email;
      if (username !== null)
        usernameOrEmailInput.value = username;
    }

    if (password !== null)
      document.getElementById('login-password').value = password;
  },
  'keypress #login-username, keypress #login-email, keypress #login-username-or-email, keypress #login-password, keypress #login-password-again': function (event) {
    if (event.keyCode === 13)
      loginOrSignup();
  }
});

Template._loginButtonsLoggedOutDropdown.helpers({
  // additional classes that can be helpful in styling the dropdown
  additionalClasses: function () {
    if (!hasPasswordService()) {
      return false;
    } else {
      if (loginButtonsSession.get('inSignupFlow')) {
        return 'login-form-create-account';
      } else if (loginButtonsSession.get('inForgotPasswordFlow')) {
        return 'login-form-forgot-password';
      } else {
        return 'login-form-sign-in';
      }
    }
  },

  dropdownVisible: function () {
    return loginButtonsSession.get('dropdownVisible');
  },

  hasPasswordService: hasPasswordService
});

// return all login services, with password last
Template._loginButtonsLoggedOutAllServices.helpers({
  services: getLoginServices,

  isPasswordService: function () {
    return this.name === 'password';
  },

  hasOtherServices: function () {
    return getLoginServices().length > 1;
  },

  hasPasswordService: hasPasswordService
});

Template._loginButtonsLoggedOutPasswordService.helpers({
  fields: function () {
    var loginFields = [
      {fieldName: 'username-or-email', fieldLabel: 'Username or Email',
       visible: function () {
         return _.contains(
           ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL"],
           passwordSignupFields());
       }},
      {fieldName: 'username', fieldLabel: 'Username',
       visible: function () {
         return passwordSignupFields() === "USERNAME_ONLY";
       }},
      {fieldName: 'email', fieldLabel: 'Email', inputType: 'email',
       visible: function () {
         return passwordSignupFields() === "EMAIL_ONLY";
       }},
      {fieldName: 'password', fieldLabel: 'Password', inputType: 'password',
       visible: function () {
         return true;
       }}
    ];

    var signupFields = [
      {fieldName: 'username', fieldLabel: 'Username',
       visible: function () {
         return _.contains(
           ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],
           passwordSignupFields());
       }},
      {fieldName: 'email', fieldLabel: 'Email', inputType: 'email',
       visible: function () {
         return _.contains(
           ["USERNAME_AND_EMAIL", "EMAIL_ONLY"],
           passwordSignupFields());
       }},
      {fieldName: 'email', fieldLabel: 'Email (optional)', inputType: 'email',
       visible: function () {
         return passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL";
       }},
      {fieldName: 'password', fieldLabel: 'Password', inputType: 'password',
       visible: function () {
         return true;
       }},
      {fieldName: 'password-again', fieldLabel: 'Password (again)',
       inputType: 'password',
       visible: function () {
         // No need to make users double-enter their password if
         // they'll necessarily have an email set, since they can use
         // the "forgot password" flow.
         return _.contains(
           ["USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],
           passwordSignupFields());
       }}
    ];

    return loginButtonsSession.get('inSignupFlow') ? signupFields : loginFields;
  },

  inForgotPasswordFlow: function () {
    return loginButtonsSession.get('inForgotPasswordFlow');
  },

  inLoginFlow: function () {
    return !loginButtonsSession.get('inSignupFlow') && !loginButtonsSession.get('inForgotPasswordFlow');
  },

  inSignupFlow: function () {
    return loginButtonsSession.get('inSignupFlow');
  },

  showCreateAccountLink: function () {
    return !Accounts._options.forbidClientAccountCreation;
  },

  showForgotPasswordLink: function () {
    return _.contains(
      ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "EMAIL_ONLY"],
      passwordSignupFields());
  }
});
*/

var _vueFormField = Vue.component('login-buttons-form-field',
{
  name: 'login-buttons-form-field',
  template: '#login-buttons-form-field-template',
  props: ['field'],
  data: function () {
    // MMDEBUG && console.log('login-buttons-form-field data this:', this);
    return {
      loginFieldNameLabelInput: `login-${this.field.fieldName}-label-and-input`,
      loginFieldNameLabel: `login-${this.field.fieldName}-label`,
      loginFieldName: `login-${this.field.fieldName}`,
      inputType: this.inputType || "text"
    };
  }
}
);


/*
Template._loginButtonsFormField.helpers({
  inputType: function () {
    return this.inputType || "text";
  }
});


//
// loginButtonsChangePassword template
//

Template._loginButtonsChangePassword.events({
  'keypress #login-old-password, keypress #login-password, keypress #login-password-again': function (event) {
    if (event.keyCode === 13)
      changePassword();
  },
  'click #login-buttons-do-change-password': function () {
    changePassword();
  }
});

Template._loginButtonsChangePassword.helpers({
  fields: function () {
    return [
      {fieldName: 'old-password', fieldLabel: 'Current Password', inputType: 'password',
       visible: function () {
         return true;
       }},
      {fieldName: 'password', fieldLabel: 'New Password', inputType: 'password',
       visible: function () {
         return true;
       }},
      {fieldName: 'password-again', fieldLabel: 'New Password (again)',
       inputType: 'password',
       visible: function () {
         // No need to make users double-enter their password if
         // they'll necessarily have an email set, since they can use
         // the "forgot password" flow.
         return _.contains(
           ["USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],
           passwordSignupFields());
       }}
    ];
  }
});
*/

//
// helpers
//

var elementValueById = function(id) {
  var element = document.getElementById(id);
  if (!element)
    return null;
  else
    return element.value;
};

var trimmedElementValueById = function(id) {
  var element = document.getElementById(id);
  if (!element)
    return null;
  else
    return element.value.replace(/^\s*|\s*$/g, ""); // trim() doesn't work on IE8;
};

var loginOrSignup = function () {
  if (loginButtonsSession.get('inSignupFlow'))
    signup();
  else
    login();
};

var login = function () {
  MMDEBUG && console.log('login');
  loginButtonsSession.resetMessages();

  var username = trimmedElementValueById('login-username');
  var email = trimmedElementValueById('login-email');
  var usernameOrEmail = trimmedElementValueById('login-username-or-email');
  // notably not trimmed. a password could (?) start or end with a space
  var password = elementValueById('login-password');

  MMDEBUG && console.log('username, email, usernameOrEmail, password: ',username, email, usernameOrEmail, password);

  var loginSelector;
  if (username !== null) {
    if (!validateUsername(username))
      return;
    else
      loginSelector = {username: username};
  } else if (email !== null) {
    if (!validateEmail(email))
      throw new Error("Invalid email");
    else
      loginSelector = {username: email};
  } else if (usernameOrEmail !== null) {
    // XXX not sure how we should validate this. but this seems good enough (for now),
    // since an email must have at least 3 characters anyways
    if (!validateUsername(usernameOrEmail))
      return;
    else
      loginSelector = {username: usernameOrEmail};
  } else {
    throw new Error("Unexpected -- no element to use as a login user selector");
  }

  console.log("Logging in username with password: ", loginSelector, password);
  Meteor.loginWithPassword(loginSelector, password, function (error, result) {
    if (error) {
      throw new Error(error.reason || "Unknown error");
      loginButtonsSession.errorMessage(error.reason || "Unknown error");
    } else {
      loginButtonsSession.closeDropdown();
    }
  });
};

var signup = function () {
  loginButtonsSession.resetMessages();

  var options = {}; // to be passed to Accounts.createUser

  var username = trimmedElementValueById('login-username');
  if (username !== null) {
    if (!validateUsername(username))
      return;
    else
      options.username = username;
  }

  var email = trimmedElementValueById('login-email');
  if (email !== null) {
    if (!validateEmail(email))
      return;
    else
      options.email = email;
  }

  // notably not trimmed. a password could (?) start or end with a space
  var password = elementValueById('login-password');
  if (!validatePassword(password))
    return;
  else
    options.password = password;

  if (!matchPasswordAgainIfPresent())
    return;

  Accounts.createUser(options, function (error) {
    if (error) {
      loginButtonsSession.errorMessage(error.reason || "Unknown error");
    } else {
      loginButtonsSession.closeDropdown();
    }
  });
};

var forgotPassword = function () {
  loginButtonsSession.resetMessages();

  var email = trimmedElementValueById("forgot-password-email");
  if (email.indexOf('@') !== -1) {
    Accounts.forgotPassword({email: email}, function (error) {
      if (error)
        loginButtonsSession.errorMessage(error.reason || "Unknown error");
      else
        loginButtonsSession.infoMessage("Email sent");
    });
  } else {
    loginButtonsSession.errorMessage("Invalid email");
  }
};

var changePassword = function () {
  loginButtonsSession.resetMessages();

  // notably not trimmed. a password could (?) start or end with a space
  var oldPassword = elementValueById('login-old-password');

  // notably not trimmed. a password could (?) start or end with a space
  var password = elementValueById('login-password');
  if (!validatePassword(password))
    return;

  if (!matchPasswordAgainIfPresent())
    return;

  Accounts.changePassword(oldPassword, password, function (error) {
    if (error) {
      loginButtonsSession.errorMessage(error.reason || "Unknown error");
    } else {
      loginButtonsSession.set('inChangePasswordFlow', false);
      loginButtonsSession.set('inMessageOnlyFlow', true);
      loginButtonsSession.infoMessage("Password changed");
    }
  });
};

var matchPasswordAgainIfPresent = function () {
  // notably not trimmed. a password could (?) start or end with a space
  var passwordAgain = elementValueById('login-password-again');
  if (passwordAgain !== null) {
    // notably not trimmed. a password could (?) start or end with a space
    var password = elementValueById('login-password');
    if (password !== passwordAgain) {
      loginButtonsSession.errorMessage("Passwords don't match");
      return false;
    }
  }
  return true;
};

export { _vueLoggedOutDropdown };
