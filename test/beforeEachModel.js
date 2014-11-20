var path = require('path');
var fs = require('fs-extra');
var Model = require('../node_modules/orion-server/src/model');
var configLoader = require('../node_modules/orion-server/src/config-loader');

module.exports = function(done) {
	var self = this;
	fs.copy(
		path.join(__dirname, 'fixtures', 'fresh.sqlite'), 
		path.join(__dirname, 'fixtures', 'database.sqlite'),
		function(err) {
			if(err) console.trace(err);
			var root = path.join(__dirname, '..');
			self.config = configLoader(root, root);
			self.config.database.storage = 'test/fixtures/database.sqlite';
			self.config.database.logging = false;
			self.model = new Model(self.config);
			self.model.load();
			done();
		}
	);
};