// Main file of package
console.log("Running meteormogul:accounts-vue-unstyled/main.js");

// for debugging in Meteor Mogul. true turns on console debugging messages.
var MMDEBUG = true;

// Giving up on this...
// export const LoginButtons = _vueLoginButtons;
// ... and instead just declaring a global variable
LoginButtons = _vueLoginButtons;
console.log('{ LoginButtons } from meteormogul:accounts-vue-unstyled/main.js', LoginButtons);

// share with package files
export { MMDEBUG };
