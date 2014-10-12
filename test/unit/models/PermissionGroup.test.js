var sinon 	= require('sinon');
var assert 	= require('chai').assert;
var Model 	= require('../../../node_modules/orion-server/src/model');

describe('PermissionGroup', function() {
	before(require('../../beforeModel'));
	// beforeEach(require('../beforeEach'));

	describe('when we add a permission group with no parent', function() {
		it('it should work', function() {
			console.log(this.model);
			assert(this.model.get('PermissionGroup'));
			// this.models.PermissionGroup.add({
			// 	name: 'test1',
			// 	permissions: [
			// 		{
			// 			code: 'EAT_CAKE',
			// 			value: true
			// 		},
			// 		{
			// 			code: 'SWIM',
			// 			value: false
			// 		},
			// 	]
			// }, this.models.PermissionGroupPermission, null, function(err, group) {
			// 	console.log(err);
			// 	assert.isNull(err);
			// 	done();
			// });
		});
	});

	// describe('when we run our request through Request', function() {
	// 	it('should add the response to the request', function() {

	// 		var req = reqGen();
	// 		var res = resGen();
	// 		Request(req, res, this.config);
			
	// 		assert.isDefined(req.res);
	// 	});

	// 	it('should add the express app to the request', function() {

	// 		var req = reqGen();
	// 		var res = resGen();
	// 		Request(req, res, this.config);
			
	// 		assert.isDefined(req.app);
	// 	});

	// 	it('should extend the express request', function() {

	// 		var req = reqGen();
	// 		var res = resGen();
	// 		Request(req, res, this.config);
			
	// 		assert.isDefined(req.header);
	// 		assert.isDefined(req.get);
	// 	});
	// });
});