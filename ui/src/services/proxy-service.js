var ProxyControlsClient = require('../../../client/proxy-controls-client');

module.exports = function (SERVER) {
  var url = 'http://' + SERVER.HOST + ':' + SERVER.PORT + '/socketpeer/';
  return new ProxyControlsClient(url);
};
