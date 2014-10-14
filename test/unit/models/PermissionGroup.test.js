var sinon 	= require('sinon');
var assert 	= require('chai').assert;
var Model 	= require('../../../node_modules/orion-server/src/model');

describe('PermissionGroup', function() {
	before(require('../../beforeModel'));
	// beforeEach(require('../beforeEach'));

	describe('when we add a permission group with no parent', function() {
		it('it should work', function(done) {
			assert(this.model.get('PermissionGroup'));
			var self = this;
			self.model.get('PermissionGroup').add({
				name: 'test1',
				permissions: [
					{
						code: 'EAT_CAKE',
						value: true
					},
					{
						code: 'SWIM',
						value: false
					},
				]
			}, null, function(err, group) {
				self.model.get('PermissionGroup').add({
					name: 'test2',
					permissions: [
						{
							code: 'EAT_CAKE',
							value: true
						},
						{
							code: 'SWIM',
							value: false
						},
					]
				}, null, function(err, group) {
					self.model.get('PermissionGroup').add({
						name: 'test3',
						permissions: [
							{
								code: 'EAT_CAKE',
								value: true
							},
							{
								code: 'SWIM',
								value: false
							},
						]
					}, group.getDataValue('id'), function(err, group) {
						self.model.get('PermissionGroup').findAll({order: [['lft', 'ASC']]}).then(function(groups) {
							assert.equal(groups[0].getDataValue('id'), 1);
							assert.equal(groups[0].getDataValue('name'), 'root');
							assert.equal(groups[0].getDataValue('lft'), 1);
							assert.equal(groups[0].getDataValue('rgt'), 8);

							assert.equal(groups[1].getDataValue('id'), 2);
							assert.equal(groups[1].getDataValue('name'), 'test1');
							assert.equal(groups[1].getDataValue('lft'), 2);
							assert.equal(groups[1].getDataValue('rgt'), 3);

							assert.equal(groups[2].getDataValue('id'), 3);
							assert.equal(groups[2].getDataValue('name'), 'test2');
							assert.equal(groups[2].getDataValue('lft'), 4);
							assert.equal(groups[2].getDataValue('rgt'), 7);

							assert.equal(groups[3].getDataValue('id'), 4);
							assert.equal(groups[3].getDataValue('name'), 'test3');
							assert.equal(groups[3].getDataValue('lft'), 5);
							assert.equal(groups[3].getDataValue('rgt'), 6);
							done();
						});
					});
				});
			});
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