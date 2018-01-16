// Main file of package
// NOTE: I tried putting this in login_buttons.js and setting that file as
//       mainModule for package. No joy.
// Doing it this way makes Meteor happy.

console.log("Running meteormogul:accounts-vue-unstyled/main.js");

// Giving up on this...
// export const LoginButtons = _vueLoginButtons;
// ... and instead just declaring a global variable
LoginButtons = _vueLoginButtons;
console.log('{ LoginButtons } from meteormogul:accounts-vue-unstyled/main.js', LoginButtons);
