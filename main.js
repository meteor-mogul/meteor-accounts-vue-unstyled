// Main file of package

// for debugging in Meteor Mogul. true turns on debugging.
// Meteor Mogul console debugging
// I find this to be a convenient entry point into the JavaScript debugger
// in Chrome and Firefox.  A console log at various points of interest makes
// it easy to set line breakpoints for closer inspection.
var MMDEBUG = true;
MMDEBUG && console.log("Running meteormogul:accounts-vue-unstyled/main.js");

// still have issues with this...
import { _vueLoginButtons } from './login_buttons.js';
LoginButtons = _vueLoginButtons;

// export symbols
MMDEBUG && console.log('export { LoginButtons } from meteormogul:accounts-vue-unstyled/main.js', LoginButtons);
export { MMDEBUG, LoginButtons };
