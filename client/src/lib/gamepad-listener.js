var Listener = require('./listener'),
    util = require('util');

function GamepadListener () {
  Listener.call(this);

  this.title = 'Gamepad';
  this.type = 'gamepad';
  this.component = 'gamepad-controls';
  this.github = 'https://github.com/donmccurdy/aframe-gamepad-controls';
}

util.inherits(GamepadListener, Listener);

GamepadListener.prototype.bind = function () {
  // TODO - implement unbind()
  if (this.__bound) return; 
  this.__bound = true;

  Listener.prototype.bind.call(this);

  var publish = function () {
    var gamepads = [];
    for (var i = 0; i < 4; i++) {
      var gamepad = navigator.getGamepads()[i];
      if (gamepad) {
        gamepads.push(cloneGamepad(gamepad));
      }
    }
    if (gamepads.length) {
      this.emit(this.type, {type: this.type, state: gamepads});
    }
    window.requestAnimationFrame(publish);
  }.bind(this);

  var cloneGamepad = function (gamepad) {
    var clone = {
      axes: gamepad.axes,
      buttons: [],
      connected: gamepad.connected,
      id: gamepad.id,
      index: gamepad.index,
      mapping: gamepad.mapping,
      timestamp: gamepad.timestamp,
    };

    for (var i = 0; i < gamepad.buttons.length; i++) {
      clone.buttons.push({
        pressed: gamepad.buttons[i].pressed,
        value: gamepad.buttons[i].value
      });
    }

    return clone;
  };

  window.requestAnimationFrame(publish);
};

GamepadListener.prototype.unbind = function () {
  // TODO
};

module.exports = GamepadListener;
