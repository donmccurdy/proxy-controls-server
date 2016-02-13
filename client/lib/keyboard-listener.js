var Listener = require('./listener'),
    util = require('util');

require('./keyboard.polyfill');

function KeyboardListener () {
  Listener.call(this);

  this.title = 'Keyboard';
  this.type = 'keyboard';
  this.component = 'keyboard-controls';
  this.github = 'https://github.com/donmccurdy/aframe-keyboard-controls';

  this.keys = {};
}

util.inherits(KeyboardListener, Listener);

KeyboardListener.prototype.bind = function () {
  Listener.prototype.bind.call(this);

  this.__listeners.keydown = this.onKeydown.bind(this);
  this.__listeners.keyup = this.onKeyup.bind(this);

  document.addEventListener('keydown', this.__listeners.keydown);
  document.addEventListener('keyup', this.__listeners.keyup);
};

KeyboardListener.prototype.onKeydown = function (e) {
  if (this.keys[e.code]) return;
  this.keys[e.code] = true;
  this.emit(this.type, {type: this.type, state: this.keys});
};

KeyboardListener.prototype.onKeyup = function (e) {
    if (!this.keys[e.code]) return;
    delete this.keys[e.code];
    this.emit(this.type, {type: this.type, state: this.keys});
};

module.exports = KeyboardListener;
