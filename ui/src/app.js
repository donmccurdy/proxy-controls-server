var ProxyControlsClient = require('../../client/proxy-controls-client');

var host = process.env.npm_package_config_host,
    port = process.env.npm_package_config_server_port;

new ProxyControlsClient('http://' + host + ':' + port + '/socketpeer/');
