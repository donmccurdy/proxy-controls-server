var ProxyControlsClient = require('../../../client/proxy-controls-client');

module.exports = function (SERVER) {
  var url = 'http://' + SERVER.HOST + ':' + SERVER.PORT + '/socketpeer/';
  return {
    get: function (pairCode) {
      return new ProxyControlsClient({url: url, pairCode: pairCode});
    }
  };
};
