'use strict';

import getDisplayMedia from './getDisplayMedia';
let exec = require('cordova/exec');

navigator.mediaDevices.getDisplayMedia = getDisplayMedia;
init = () => {
  exec(null, null, 'WebRTCModule', 'init', null);
}

export {
  getDisplayMedia,
  init
};
