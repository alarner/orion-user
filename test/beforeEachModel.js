var path = require('path');
var fs = require('fs-extra');
module.exports = function(done) {
	fs.copy(
		path.join(__dirname, 'fixtures', 'fresh.sqlite'), 
		path.join(__dirname, 'fixtures', 'database.sqlite'),
		done
	);
};