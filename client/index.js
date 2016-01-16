require('keyboardevent-key-polyfill').polyfill();

var SocketPeer = require('socketpeer'),
    EventEmitter = require('events'),
    util = require('util');

var ProxyControlsClient = function () {
  EventEmitter.call(this);

  var host = process.env.npm_package_config_host,
      port = process.env.npm_package_config_server_port;

  /** @type {SocketPeer} WebRTC connection. */
  this.peer = new SocketPeer({
    pairCode: 'my-room',
    socketFallback: true,
    url: 'http://' + host + ':' + port + '/socketpeer/',
    autoconnect: false
  });

  this.init();
};

util.inherits(ProxyControlsClient, EventEmitter);

/**
 * Initializes SocketPeer connection with broker server, and begins listening
 * for client connections.
 */
ProxyControlsClient.prototype.init = function () {
  var self = this;
  var peer = this.peer;

  console.log('init');
  peer.on('connect', function () {
    console.info('connect()');
    self.bindKeyboardEvents();
    self.bindGamepadEvents();
  });
  peer.on('upgrade', function () {
    console.info('upgrade()');
    peer.send({hello: 'world'});
  });
  peer.on('connect_error', function () {
    console.error('connect_error()');
  });
  peer.on('connect_timeout', function () {
    console.warn('connect_timeout()');
  });
  peer.on('data', function (data) {
    console.log('data()');
    console.info(data);
  });
  peer.on('close', function () {
    console.info('close()');
  });
  peer.on('error', function () {
    console.error('error()');
  });

  peer.connect();
};

/**
 * Binds keyboard events to shared datachannel.
 */
ProxyControlsClient.prototype.bindKeyboardEvents = function () {
  var keys = {};

  var publish = function () {
    this.peer.send({type: 'keyboard', state: Object.keys(keys)});
  }.bind(this);

  document.addEventListener('keydown', function (e) {
    if (keys[e.key]) return;
    keys[e.key] = true;
    publish();
  });

  document.addEventListener('keyup', function (e) {
    if (!keys[e.key]) return;
    delete keys[e.key];
    publish();
  });
};

/**
 * Binds Gamepad events to shared datachannel. 
 */
ProxyControlsClient.prototype.bindGamepadEvents = function () {
  var publish = function () {
    var gamepads = [];
    for (var i = 0; i < 4; i++) {
      var gamepad = navigator.getGamepads()[i];
      if (gamepad) {
        gamepads.push(cloneGamepad(gamepad));
      }
    }
    if (gamepads.length) {
      this.peer.send({type: 'gamepad', state: gamepads});
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

module.exports = window.ProxyControlsClient = ProxyControlsClient;
