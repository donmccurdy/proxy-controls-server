require('keyboardevent-key-polyfill').polyfill();

var P2P = require('socket.io-p2p'),
    io = require('socket.io-client'),
    EventEmitter = require('events'),
    util = require('util');

var ProxyControlsClient = function () {
  EventEmitter.call(this);

  var host = process.env.npm_package_config_host,
      port = process.env.npm_package_config_server_port;

  /** @type {IO} Socket.IO socket. */
  this.socket = io(host + ':' + port);

  /** @type {P2P} Socket.IO P2P instance. */
  this.p2p = new P2P(this.socket);

  this.init();
};

util.inherits(ProxyControlsClient, EventEmitter);

/**
 * Initializes PeerJS connection with broker server, and begins listening for
 * client connections.
 */
ProxyControlsClient.prototype.init = function () {
  console.log('init');
  this.p2p.on('ready', function(){
    console.log('ready');
    this.p2p.usePeerConnection = true;
    this.p2p.emit('msg', { peerId: 'it me' });
  }.bind(this));
  this.p2p.on('msg', console.info.bind(console, 'p2p:msg(%s)'));
};

/**
 * Connect to remote application by PeerJS ID.
 * @param  {string} id
 */
ProxyControlsClient.prototype.connect = function (id) {
  console.log('wat');
  // this.conn = this.peer.connect(id);
  // this.conn.on('open', function () {
  //  console.info('peer:open(%s)', id);
  //  this.bindKeyboardEvents();
  //  this.bindGamepadEvents();
  //  this.emit('open', {id: id});
  // }.bind(this));
  // this.conn.on('data', console.log.bind(console, 'peer:data(%s)'));
  // this.conn.on('error', console.error.bind(console, 'peer:error(%s)'));
};

/**
 * Binds keyboard events to shared datachannel.
 */
ProxyControlsClient.prototype.bindKeyboardEvents = function () {
  var keys = {};

  var publish = function () {
    this.conn.send({type: 'keyboard', state: Object.keys(keys)});
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
      this.conn.send({type: 'gamepad', state: gamepads});
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
