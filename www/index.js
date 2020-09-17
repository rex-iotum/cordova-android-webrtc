'use strict';

import getDisplayMedia from './getDisplayMedia';

navigator.mediaDevices.getDisplayMedia = getDisplayMedia;

export {
  getDisplayMedia
};
