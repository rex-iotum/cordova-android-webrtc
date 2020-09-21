'use strict';

import EventTarget from 'event-target-shim';
import MediaStreamErrorEvent from './MediaStreamErrorEvent';

import type MediaStreamError from './MediaStreamError';

let exec = require('cordova/exec');

const MEDIA_STREAM_TRACK_EVENTS = [
  'ended',
  'mute',
  'unmute',
  // see: https://www.w3.org/TR/mediacapture-streams/#constrainable-interface
  'overconstrained',
];

type MediaStreamTrackState = "live" | "ended";

type SourceInfo = {
  id: string;
  label: string;
  facing: string;
  kind: string;
};

class MediaStreamTrack extends EventTarget(MEDIA_STREAM_TRACK_EVENTS) {
  _enabled: boolean;
  id: string;
  kind: string;
  label: string;
  muted: boolean;
  readonly: boolean; // how to decide?
  // readyState in java: INITIALIZING, LIVE, ENDED, FAILED
  readyState: MediaStreamTrackState;
  remote: boolean;

  onended: ?Function;
  onmute: ?Function;
  onunmute: ?Function;
  overconstrained: ?Function;

  constructor(info) {
    super();

    let _readyState = info.readyState.toLowerCase();
    this._enabled = info.enabled;
    this.id = info.id;
    this.kind = info.kind;
    this.label = info.label;
    this.muted = false;
    this.readonly = true; // how to decide?
    this.remote = info.remote;
    this.readyState = (_readyState === "initializing"
      || _readyState === "live") ? "live" : "ended";
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(enabled: boolean): void {
    if (enabled === this._enabled) {
      return;
    }
    exec(null, null, 'WebRTCModule', 'mediaStreamTrackSetEnabled', [this.id, !this._enabled]);
    this._enabled = !this._enabled;
    this.muted = !this._enabled;
  }

  stop() {
    exec(null, null, 'WebRTCModule', 'mediaStreamTrackSetEnabled', [this.id, false]);
    this.readyState = 'ended';
    // TODO: save some stopped flag?
  }

  applyConstraints() {
    return Promise.resolve();
  }

  clone() {
    throw new Error('Not implemented.');
  }

  getCapabilities() {
    throw new Error('Not implemented.');
  }

  getConstraints() {
    throw new Error('Not implemented.');
  }

  getSettings() {
    throw new Error('Not implemented.');
  }

  release() {
    exec(null, null, 'WebRTCModule', 'mediaStreamTrackRelease', [this.id]);
  }
}

export default MediaStreamTrack;
