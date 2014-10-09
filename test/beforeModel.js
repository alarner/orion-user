var path = require('path');
var Model = require('../node_modules/orion-server/src/model');
var configLoader = require('../node_modules/orion-server/src/config-loader');
module.exports = function(done) {
	var root = path.join(__dirname, '..');
	this.config = configLoader(root, root);
	this.model = new Model(this.config);
	this.model.loadDatabase(done);
};