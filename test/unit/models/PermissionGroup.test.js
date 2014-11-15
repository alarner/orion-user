var sinon 	= require('sinon');
var assert 	= require('chai').assert;
var Model 	= require('../../../node_modules/orion-server/src/model');

// @todo: there's some sort of error where individual tests are 
// effecting each other, possibly because the database is not 
// refreshing properly

describe('PermissionGroup', function() {
	before(require('../../beforeModel'));
	beforeEach(require('../../beforeEachModel'));

	describe('when we add a permission group', function() {
		describe('with null and valid parent permission group ids', function() {
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
					}, null, self.config, function(err, group) {
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
						}, null, self.config, function(err, group) {
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
							}, group.getDataValue('id'), self.config, function(err, group) {
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

		describe('with an invalid parent permission group id', function() {
			it('should return an UNKNOWN_PERMISSION_GROUP error', function(done) {
				var self = this;
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
					}, 23, self.config, function(err, group) {
						assert.deepEqual(err, self.config.errors.UNKNOWN_PERMISSION_GROUP);
						done();
					});
				});
			});
		});
	});

	describe('when we flatten a permission group', function() {
		it('should inherit permission information from the parents', function(done) {
			this.model.get('PermissionGroup').flatten(4, function(err, permissions) {
				assert(!err);
				assert.ok(permissions[null].EAT_CAKE.value);
				assert.notOk(permissions[null].SWIM.value);
				assert.notOk(permissions[null].DRINK_BEER.value);
				assert.notOk(permissions[null].FLY.value);
				assert.isUndefined(permissions[null].CODE);
				done();
			});
		});
	});
});