'use strict';

let exec = require('cordova/exec');

import * as RTCUtil from './RTCUtil';

import MediaStream from './MediaStream';
import MediaStreamError from './MediaStreamError';

const getDisplayMedia = function (constraints = {}) {
  if (typeof constraints !== 'object') {
    return Promise.reject(new TypeError('constraints is not a dictionary'));
  }

  if ((typeof constraints.video === 'undefined' || !constraints.video)) {
    return Promise.reject(new TypeError('video is required'));
  }

  // Normalize constraints.
  constraints = RTCUtil.normalizeConstraints(constraints);

  return new Promise((resolve, reject) => {
    exec((id, tracks) => {
      let stream = new MediaStream({
        streamId: id,
        streamReactTag: id,
        tracks
      });
      stream._tracks.forEach(track => {
        track.applyConstraints = function () {
          // FIXME: ScreenObtainer.obtainScreenFromGetDisplayMedia.
          return Promise.resolve();
        }.bind(track);
      })
      resolve(stream);
    }, (type, message) => {
      let error;
      switch (type) {
        case 'TypeError':
          error = new TypeError(message);
          break;
      }
      if (!error) {
        error = new MediaStreamError({ message, name: type });
      }
      reject(error);
    }, null, 'WebRTCModule', 'getDisplayMedia', [constraints])
  });
}

export default getDisplayMedia;
