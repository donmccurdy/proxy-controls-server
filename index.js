var dotenv = require('dotenv'),
    WebServer = require('./server/webserver');

dotenv.load();

new WebServer({ port: process.env.PORT || 3000 }); // jshint ignore:line
