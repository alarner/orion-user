var sinon 	= require('sinon');
var assert 	= require('chai').assert;
var Model 	= require('../../../node_modules/orion-server/src/model');

describe('PermissionGroup', function() {
	before(require('../../beforeModel'));
	beforeEach(require('../../beforeEachModel'));

	describe('when we add a permission group', function() {
		it('it should work', function(done) {
			var self = this;
			assert(this.model.get('PermissionGroup'));
			// Truncate the database to start from scratch
			this.model.sequelize.sync({force: true}).then(function() {
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
						{
							code: 'CODE',
							value: true
						},
						{
							code: 'DRINK_BEER',
							value: true
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
							{
								code: 'FLY',
								value: true
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
								{
									code: 'FLY',
									value: false
								},
								{
									code: 'DRINK_BEER',
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

								self.model.get('PermissionGroup').hierarchy(function(err, hierarchy) {
									assert.equal(hierarchy.getDataValue('id'), 1);
									var child = hierarchy.children[0];
									assert.isDefined(child);
									assert.equal(child.getDataValue('id'), 2);
									assert.deepEqual(child.children, []);
									var child = hierarchy.children[1];
									assert.isDefined(child);
									assert.equal(child.getDataValue('id'), 3);
									var child = child.children[0];
									assert.isDefined(child);
									assert.equal(child.getDataValue('id'), 4);
									done();
								});
							});
						});
					});
				});
			});
		});
	});

	describe('when we flatten a permission group', function() {
		it('should inherit permission information from the parents', function(done) {
			this.model.get('PermissionGroup').flatten(4, function(err, permissions) {
				assert.ok(permissions[null].EAT_CAKE.value);
				assert.notOk(permissions[null].SWIM.value);
				assert.notOk(permissions[null].DRINK_BEER.value);
				assert.notOk(permissions[null].FLY.value);
				assert.isUndefined(permissions[null].CODE);
				done();
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