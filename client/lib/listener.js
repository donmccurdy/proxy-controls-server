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
  this.enabled = true;
}

util.inherits(Listener, EventEmitter);

Listener.prototype.emit = function () {
  if (!this.enabled) return;
  EventEmitter.prototype.emit.apply(this, arguments);
};

Listener.prototype.bind = function () {};

Listener.prototype.unbind = function () {
  for (var event in this.__listeners) {
    if (this.__listeners.hasOwnProperty(event)) {
      document.removeEventListener(event, this.__listeners[event]);
      delete this.__listeners[event];
    }
  }
};

Listener.prototype.destroy = function () {
  this.unbind();
};

Listener.prototype.isEnabled = function () {
  return this.enabled;
};

Listener.prototype.setEnabled = function (enabled) {
  this.enabled = !!enabled;
};

module.exports = Listener;
