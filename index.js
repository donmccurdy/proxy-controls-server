var fs = require('fs'),
    dotenv = require('dotenv'),
    ProxyControlsServer = require('./server/proxy-controls-server');

dotenv.config({silent: true});

if (process.env.SSL_PORT) {
  new ProxyControlsServer({
    port: process.env.PORT,
    sslPort: process.env.SSL_PORT,
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  });
} else {
  new ProxyControlsServer({
    port: process.env.PORT || process.env.npm_package_config_port
  });
}

