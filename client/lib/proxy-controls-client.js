var SocketPeer = require('socketpeer'),
    EventEmitter = require('events'),
    util = require('util'),
    KeyboardListener = require('./keyboard-listener'),
    GamepadListener = require('./gamepad-listener');

/**
 * Polling configuration.
 *
 * The purpose of polling on WebSockets is keep the socket from closing on
 * certain hosts, e.g. Heroku. A long interval (1s) is fine for this. When
 * polling on WebRTC, the goal is to keep the DataChannel primed – latency
 * seems to degrade when data is sent less frequently. WebRTC requires higher-
 * frequency polling.
 *
 * In both cases, polling also allows us to measure average latency.
 * 
 * @type {string: {BUFFER_SIZE: number, INTERVAL: number}}
 */
var POLLING = {
  rtc: {BUFFER_SIZE: 50, INTERVAL: 20},
  socket: {BUFFER_SIZE: 5, INTERVAL: 1000}
};

/**
 * UI controller for client running on host machine. Records user input and
 * forwards events to remote client / viewer application.
 *
 * Options:
 * - url: (required) URL of ProxyControlsServer instance.
 * - pairCode: (required) Identifier for this client. 
 * 
 * @param {Object} options Client configuration.
 */
var ProxyControlsClient = function (options) {
  EventEmitter.call(this);

  /** @type {SocketPeer} WebRTC connection. */
  this.peer = new SocketPeer({
    url: options.url,
    pairCode: options.pairCode,
    socketFallback: true,
  });

  /** @type {string:Listener} Listeners bound to document events. */
  this.listeners = [
    new KeyboardListener(),
    new GamepadListener()
  ];

  /** @type {string:boolean} Keyboard state, [key]->true. */
  this.keys = {};

  /** @type {Array<number>} Circular array of recent ping measurements. */
  this.pingList = [];

  /** @type {number} Index at which next polling results are inserted. */
  this.pingListIndex = 0;

  /** @type {number} Interval ID for ping / latency polling. */
  this.pingIntervalID = 0;

  this.onConnect = this.onConnect.bind(this);
  this.onDisconnect = this.onDisconnect.bind(this);
  this.onClose = this.onClose.bind(this);
  this.onUpgrade = this.onUpgrade.bind(this);
  this.onDowngrade = this.onDowngrade.bind(this);
  this.onConnectError = this.onConnectError.bind(this);
  this.onConnectTimeout = this.onConnectTimeout.bind(this);
  this.onData = this.onData.bind(this);
  this.onError = this.onError.bind(this);

  this.bindEvents();
};

util.inherits(ProxyControlsClient, EventEmitter);

/**
 * Initializes SocketPeer connection with broker server, and begins listening
 * for peer connections.
 */
ProxyControlsClient.prototype.bindEvents = function () {
  this.peer.on('connect', this.onConnect);
  this.peer.on('connect_error', this.onConnectError);
  this.peer.on('connect_timeout', this.onConnectTimeout);
  this.peer.on('upgrade', this.onUpgrade);
  this.peer.on('error', this.onError);
  this.peer.on('data', this.onData);
  this.peer.on('disconnect', this.onDisconnect);
  this.peer.on('close', this.onClose);

  var self = this;
  this.listeners.forEach(function (listener) {
    listener.on(listener.type, function (e) {
      self.peer.send(e);
      self.emit(listener.type, e);
      console.log('publish(%s)', JSON.stringify(e, null, 2));
    });
  });
};

/* Initialization
–––––––––––––––––––––––––––––––––––––––––––––––––– */

/**
 * Begins sending pings to poll for latency, and also to keep the DataChannel
 * or WebSocket active. Resets polling, if it has already begun.
 * 
 * Purpose: Some hosts (e.g. Heroku) will close WebSockets if they are
 * inactive for too long. On the other hand, WebRTC DataChannels appear to
 * perform better (lower average latency) if they're kept active. So in both
 * cases, we want to keep data moving through.
 */
ProxyControlsClient.prototype.resetPings = function () {
  // Cancel existing polling.
  if (this.pingIntervalID) {
    clearInterval(this.pingIntervalID);
  }

  // Only poll while connected.
  var protocol = this.getPeerProtocol();
  if (!protocol) return;

  this.pingListIndex = 0;
  this.pingList = [];

  // Ping remote peer at regular intervals.
  this.pingIntervalID = setInterval(function () {
    if (this.getPeerProtocol()) {
      this.peer.send({type: 'ping', timestamp: Date.now()});
    } else {
      this.resetPings();
    }
  }.bind(this), POLLING[protocol].INTERVAL);

  console.info('Now polling every %dms', POLLING[protocol].INTERVAL);
};

/**
 * Removes all event bindings and destroys dependencies.
 */
ProxyControlsClient.prototype.destroy = function () {
  if (this.pingIntervalID) {
    clearInterval(this.pingIntervalID);
  }

  this.listeners.forEach(function (listener) {
    listener.destroy();
  });

  this.peer.close();
};

/* Event bindings
–––––––––––––––––––––––––––––––––––––––––––––––––– */

ProxyControlsClient.prototype.onConnect = function () {
  console.info('connect()');
  this.listeners.forEach(function (listener) { listener.bind(); });
  this.resetPings();
  
};

ProxyControlsClient.prototype.onConnectError = function () {
  console.error('connect_error()');
};

ProxyControlsClient.prototype.onConnectTimeout = function () {
  console.warn('connect_timeout()');
};

ProxyControlsClient.prototype.onDisconnect = function () {
  console.info('disconnect()');
  this.listeners.forEach(function (listener) { listener.unbind(); });
  this.resetPings();
};

ProxyControlsClient.prototype.onData = function (event) {
  if (event.type === 'ping') {
    console.log('PING');
    var protocol = this.getPeerProtocol();
    if (!protocol) return;
    this.pingList[this.pingListIndex] = (Date.now() - event.timestamp) / 2;
    this.pingListIndex = (this.pingListIndex + 1) % POLLING[protocol].BUFFER_SIZE;
  } else {
    console.log('data(%s)', JSON.stringify(event, null, 2));
  }
};

ProxyControlsClient.prototype.onError = function () {
  console.error('error()');
};

ProxyControlsClient.prototype.onClose = function () {
  console.info('close()');
  this.listeners.forEach(function (listener) { listener.unbind(); });
  this.resetPings();
};

ProxyControlsClient.prototype.onUpgrade = function () {
  console.info('upgrade()');
  this.resetPings();
};

ProxyControlsClient.prototype.onDowngrade = function () {
  console.info('downgrade()');
  this.resetPings();
};


/* Accessors
–––––––––––––––––––––––––––––––––––––––––––––––––– */

ProxyControlsClient.prototype.isServerConnected = function () {
  return this.peer.socket.readyState === WebSocket.OPEN;
};

ProxyControlsClient.prototype.isPeerConnected = function () {
  return this.peer.peerConnected;
};

ProxyControlsClient.prototype.getPeerProtocol = function () {
  if (this.peer.rtcConnected) {
    return 'rtc';
  } else if (this.peer.socketConnected && this.peer.peerConnected) {
    return 'socket';
  }
  return null;
};

ProxyControlsClient.prototype.getPeerLatency = function () {
  if (!this.pingList.length) return NaN;
  var avgLatency = 0;
  for (var i = 0; i < this.pingList.length; i++) {
    avgLatency += this.pingList[i];
  }
  return Math.round(avgLatency / this.pingList.length);
};

module.exports = ProxyControlsClient;
