'use strict';
var SocketPeerServer = require('socketpeer');

function ProxyControlsServer (options) {
  this.options = {
    port: options.port
  };

  this.socketServer = new SocketPeerServer({
    port: this.options.port,
    serveLibrary: false
  });
}

module.exports = ProxyControlsServer;
