var app = require('angular').module('proxyControlsApp');

app
	.controller('ConnectCtrl', require('./connect-ctrl'))
	.controller('HomeCtrl', require('./home-ctrl'))
	.controller('NavCtrl', require('./nav-ctrl'));
