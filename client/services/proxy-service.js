var ProxyControlsClient = require('../lib/proxy-controls-client');

module.exports = function (RESOURCES) {
  return {
    get: function (pairCode) {
      return new ProxyControlsClient({url: RESOURCES.SOCKET_PATH, pairCode: pairCode});
    }
  };
};
