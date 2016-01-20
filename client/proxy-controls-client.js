var SocketPeer = require('socketpeer'),
    EventEmitter = require('events'),
    util = require('util'),
    KeyboardListener = require('./keyboard-listener'),
    GamepadListener = require('./gamepad-listener');

var ProxyControlsClient = function (url) {
  EventEmitter.call(this);

  /** @type {SocketPeer} WebRTC connection. */
  this.peer = new SocketPeer({
    pairCode: 'my-room',
    socketFallback: true,
    url: url
  });

  /** @type {string:Listener} Listeners bound to document events. */
  this.listeners = [
    new KeyboardListener(),
    new GamepadListener()
  ];

  /** @type {string:boolean} Keyboard state, [key]->true. */
  this.keys = {};

  this.initConnection();
  this.initListeners();
};

util.inherits(ProxyControlsClient, EventEmitter);

/**
 * Initializes SocketPeer connection with broker server, and begins listening
 * for peer connections.
 */
ProxyControlsClient.prototype.initConnection = function () {
  var peer = this.peer;

  console.log('init');
  peer.on('connect', function () {
    console.info('connect()');
    this.listeners.forEach(function (listener) { listener.bind(); });
  }.bind(this));
  peer.on('connect_error', function () { console.error('connect_error()'); });
  peer.on('connect_timeout', function () { console.warn('connect_timeout()'); });
  peer.on('upgrade', function () { console.info('upgrade()'); });
  peer.on('error', function () { console.error('error()'); });
  peer.on('data', function (data) {
    console.log('data(%s)', JSON.stringify(data, null, 2));
  });
  peer.on('close', function () {
    this.listeners.forEach(function (listener) { listener.unbind(); });
    console.info('close()');
  }.bind(this));
};

/**
 * Binds to listener events, forwarding each to remote peer.
 */
ProxyControlsClient.prototype.initListeners = function () {
  var self = this;
  this.listeners.forEach(function (listener) {
    listener.on(listener.type, function (e) {
      self.peer.send(e);
      self.emit(listener.type, e);
      console.log('publish(%s)', JSON.stringify(e, null, 2));
    });
  });
};

ProxyControlsClient.prototype.isServerConnected = function () {
  return this.peer.socket.readyState === WebSocket.OPEN;
};

ProxyControlsClient.prototype.isPeerConnected = function () {
  return this.peer.rtcConnected || this.peer.socketConnected;
};

ProxyControlsClient.prototype.getProtocol = function () {
  if (this.peer.rtcConnected) {
    return 'rtc';
  } else if (this.peer.socketConnected) {
    return 'socket';
  }
  return null;
};

module.exports = ProxyControlsClient;
