// Main file of package
// NOTE: I tried putting this in login_buttons.js and setting that file as
//       mainModule for package. No joy.
// Doing it this way makes Meteor happy.

import { Vue } from 'meteor/meteormogul:vue-dist';

export const LoginButtons = Vue.component("login-buttons", {
  template: "#login-buttons-template"
});
