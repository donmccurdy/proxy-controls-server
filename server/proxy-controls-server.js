'use strict';
var koa = require('koa'),
    cors = require('koa-cors'),
    route = require('koa-route'),
    resources = require('koa-static'),
    SocketPeerServer = require('socketpeer'),
    moniker = require('moniker');

/**
 * Server to proxy keyboard/gamepad controls between devices, peer-to-peer,
 * over WebRTC. Uses WebSockets as a fallback connection.
 *
 * Additionally, the ProxyControlsServer is responsible for serving the client
 * UI for the host machine, which receives user input to be sent to the remote
 * client / viewing device.
 *
 * @param {Object} options Server configuration options.
 */
function ProxyControlsServer (options) {
  this.options = {port: options.port};

  /** @type {Koa} Koa application, to serve client UI and AJAX endpoints. */
  this.app = koa()
    .use(cors({origin: true}))
    .use(resources('client'))
    .use(route.get('/ajax/nearby', this.routeNearby()))
    .use(route.get('/ajax/pair-code', this.routePairCode()));

  /** @type {http.Server} Server, to support both Koa and SocketPeerServer. */
  this.httpServer = this.app.listen(this.options.port);

  /** @type {SocketPeerServer} WebSocket / WebRTC connection broker. */
  this.socketServer = new SocketPeerServer({
    httpServer: this.httpServer,
    serveLibrary: false
  });

  console.info('ProxyControlsServer listening on port %d.', this.options.port);
}

/**
 * Suggests nearby peers, assuming same public IP.
 */
ProxyControlsServer.prototype.routeNearby = function () {
  return function *() {
    // TODO - Implement.
    this.body = {count: 0, peers: []};
  };
};

/**
 * Returns a unique pair code for client.
 */
ProxyControlsServer.prototype.routePairCode = function () {
  return function *() {
    // TODO - Verify that pair code is not already in the waiting pool, and that
    // the code hasn't been assigned to another client in the last ~60s.
    this.body = {pairCode: moniker.choose()};
  };
};

module.exports = ProxyControlsServer;
