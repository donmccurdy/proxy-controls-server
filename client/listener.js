var EventEmitter = require('events'),
    util = require('util');

function Listener () {
  EventEmitter.call(this);

  /** @type {string:function} Event types and callbacks for document events. */
  this.__listeners = {};

  /** @type {string} User-facing label for the listener. */
  this.title = '';

  /** @type {string} Event type for the listener. */
  this.type = '';

  /** @type {boolean} Enabled/disabled state. */
  this.enabled = false;
}

util.inherits(Listener, EventEmitter);

Listener.prototype.bind = function () {
  this.enabled = true;
};

Listener.prototype.unbind = function () {
  for (var event in this.__listeners) {
    if (this.__listeners.hasOwnProperty(event)) {
      document.removeEventListener(event, this.__listeners[event]);
    }
  }
  this.__listeners = {};
  this.enabled = false;
};

module.exports = Listener;
