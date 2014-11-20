var path = require('path');
var Model = require('./node_modules/orion-server/src/model');
var configLoader = require('./node_modules/orion-server/src/config-loader');

var root = path.join(__dirname, './');
var config = configLoader(root, root);
config.database.logging = false;
var model = new Model(config);
model.load();
model.sequelize.sync({force: true}).then(function() {
	process.exit(0);
});
