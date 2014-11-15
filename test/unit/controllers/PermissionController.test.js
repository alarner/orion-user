var sinon 	= require('sinon');
var assert 	= require('chai').assert;
var req 	= require('../../fixtures/req.js');
var res 	= require('../../fixtures/res.js');
var model 	= require('../../fixtures/model.js');
var PermissionController 	= require('../../../app/controllers/PermissionController');

describe('PermissionController', function() {
	before(require('../../beforeModel'));
	beforeEach(require('../../beforeEachModel'));

	describe('when we call the index action', function() {
		it('it should load the permission hierarchy', function() {
			var self = this;
			assert(PermissionController.index);
			var req = {};
			var res = {};
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
				PermissionController.group(req, res, this.model, this.config);
				assert(res.stubs.api.setError.calledWith(this.config.errors.MISSING_PERMISSION_GROUP_ID));
				assert(res.stubs.api.send.callCount, 1);
			});
		});
		describe('with an id', function() {
			it('should set the permission group', function() {
				req.info.params.id = 1;
				PermissionController.group(req, res, model, this.config);
				assert(res.stubs.api.setData.calledWith('flattened permissions'));
				assert(res.stubs.api.send.callCount, 1);
			});
		});
	});
});