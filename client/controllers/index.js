var app = require('angular').module('proxyControlsApp');

app
	.controller('NavCtrl', require('./nav-ctrl'))
	.controller('ConnectCtrl', require('./connect-ctrl'));
