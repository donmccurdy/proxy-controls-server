var WebServer = require('./server/webserver');
new WebServer({
  port: process.env.npm_package_config_server_port || process.env.PORT
});
