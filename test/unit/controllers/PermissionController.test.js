var sinon 	= require('sinon');
var assert 	= require('chai').assert;
var Req 	= require('../../fixtures/req.js');
var Res 	= require('../../fixtures/res.js');
var Model 	= require('../../fixtures/model.js');
var PermissionController 	= require('../../../app/controllers/PermissionController');

describe('PermissionController', function() {
	before(require('../../beforeModel'));
	beforeEach(require('../../beforeEachModel'));

	describe('when we call the index action', function() {
		it('it should load the permission hierarchy', function() {
			var self = this;
			assert(PermissionController.index);
			var req = new Req();
			var res = new Res();
			var hierarchyStub = sinon.stub();
			var model = {
				get: sinon.stub().returns({
					hierarchy: hierarchyStub
				})
			};
			PermissionController.index(req, res, model, this.config);
			assert(model.get.calledWith('PermissionGroup'));
			assert.equal(hierarchyStub.callCount, 1);
		});
	});

	describe('when we call the group action', function() {
		describe('with no id', function() {
			it('should set an error', function() {
				var req = new Req();
				var res = new Res();
				PermissionController.group(req, res, this.model, this.config);
				assert(res.stubs.api.setError.calledWith(this.config.errors.MISSING_PERMISSION_GROUP_ID));
				assert.equal(res.stubs.api.send.callCount, 1);
			});
		});
		describe('with an id', function() {
			it('should set the permission group', function() {
				var req = new Req();
				var res = new Res();
				var model = new Model();
				req.info.params.id = 1;
				PermissionController.group(req, res, model, this.config);
				assert(res.stubs.api.setData.calledWith('flattened permissions'));
				assert.equal(res.stubs.api.send.callCount, 1);
			});
		});
	});

	describe('when we call the groupPermission action', function() {
		describe('with no groupId', function() {
			it('should set an error', function() {
				var req = new Req();
				var res = new Res();
				req.info.params = {
					permissionCode: 'TEST_PERMISSION_CODE',
				};
				req.body = { value: 'inherit' };
				PermissionController.group(req, res, this.model, this.config);
				assert(res.stubs.api.setError.calledWith(this.config.errors.MISSING_PERMISSION_GROUP_ID));
				assert.equal(res.stubs.api.send.callCount, 1);
			});
		});
		describe('with no permissionCode', function() {
			it('should set an error', function() {
				var req = new Req();
				var res = new Res();
				req.info.params = {
					groupId: 1,
				};
				req.body = { value: 'inherit' };
				PermissionController.groupPermission(req, res, this.model, this.config);
				assert(res.stubs.api.setError.calledWith(this.config.errors.MISSING_PERMISSION_CODE));
				assert.equal(res.stubs.api.send.callCount, 1);
			});
		});
		describe('with no value', function() {
			it('should set an error', function() {
				var req = new Req();
				var res = new Res();
				req.info.params = {
					groupId: 1,
					permissionCode: 'TEST_PERMISSION_CODE'
				};
				req.body = {};
				PermissionController.groupPermission(req, res, this.model, this.config);
				assert(res.stubs.api.setError.calledWith(this.config.errors.MISSING_PERMISSION_VALUE));
				assert.equal(res.stubs.api.send.callCount, 1);
			});
		});

		describe('with an invalid value', function() {
			it('should set an error', function() {
				var req = new Req();
				var res = new Res();
				var model = new Model();
				req.info.params = {
					groupId: 1,
					permissionCode: 'TEST_PERMISSION_CODE'
				};
				req.body = { value: 'test' };
				PermissionController.groupPermission(req, res, model, this.config);
				assert(res.stubs.api.setError.calledWith(this.config.errors.INVALID_PERMISSION_VALUE));
				assert.equal(res.stubs.api.send.callCount, 1);
			});
		});

		describe('with all valid data', function() {
			describe('and a value of grant', function() {
				it('should run successfully', function() {
					var req = new Req();
					var res = new Res();
					var model = new Model();
					req.info.params = {
						groupId: 1,
						permissionCode: 'TEST_PERMISSION_CODE'
					};
					req.body = { value: 'grant' };
					PermissionController.groupPermission(req, res, model, this.config);
					assert.equal(model.stubs.findOrCreate.callCount, 1);
					assert(res.stubs.api.setData.calledWith('flattened permissions'));
					assert.equal(res.stubs.api.send.callCount, 1);
				});
			});
			describe('and a value of inherit', function() {
				it('should run successfully', function() {
					var req = new Req();
					var res = new Res();
					var model = new Model();
					req.info.params = {
						groupId: 1,
						permissionCode: 'TEST_PERMISSION_CODE'
					};
					req.body = { value: 'inherit' };
					PermissionController.groupPermission(req, res, model, this.config);
					assert.equal(model.stubs.destroy.callCount, 1);
					assert(res.stubs.api.setData.calledWith('flattened permissions'));
					assert.equal(res.stubs.api.send.callCount, 1);
				});
			});
		});
	});
});