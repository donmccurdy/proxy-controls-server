var ProxyControlsClient = require('../lib/proxy-controls-client');

module.exports = function (SERVER) {
  return {
    get: function (pairCode) {
      return new ProxyControlsClient({url: SERVER.SOCKET_PATH, pairCode: pairCode});
    }
  };
};
