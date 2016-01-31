var app = require('angular').module('proxyControlsApp');

app
	.controller('ConnectCtrl', require('./connect-ctrl'))
	.controller('DocsCtrl', require('./docs-ctrl'))
	.controller('HomeCtrl', require('./home-ctrl'))
	.controller('NavCtrl', require('./nav-ctrl'));
