var sinon 	= require('sinon');
module.exports = function() {
	var hierarchyStub = sinon.stub();
	var flattenStub = sinon.stub();
	var flattenCallbackStub = sinon.stub();
	var findOrCreateModelSavePromise = sinon.stub();
	var findOrCreateModel = {
		setDataValue: sinon.stub(),
		save: sinon.stub().returns({
			then: findOrCreateModelSavePromise.callsArg(0)
		})
	};
	var findOrCreatePromise = sinon.stub().callsArgWith(0, [findOrCreateModel]);
	var findOrCreateStub = sinon.stub().returns({
		then: findOrCreatePromise
	});
	var destroyPromise = sinon.stub().callsArgWith(0, 'destroy result');
	var destroyStub = sinon.stub().returns({
		then: destroyPromise
	});

	this.get = sinon.stub().returns({
		hierarchy: hierarchyStub,
		flatten: flattenStub.callsArgWith(1, null, 'flattened permissions'),
		findOrCreate: findOrCreateStub,
		destroy: destroyStub
	});
	this.stubs = {
		PermissionGroup: {
			hierarchy: hierarchyStub,
			flatten: flattenStub
		},
		findOrCreate: findOrCreateStub,
		findOrCreatePromise: findOrCreatePromise,
		findOrCreateModel: findOrCreateModel,
		destroy: destroyStub,
		destroyPromise: destroyPromise
	};
};