var ProxyControlsServer = require('./server/proxy-controls-server');
new ProxyControlsServer({
  port: process.env.npm_package_config_server_port || process.env.PORT
});
