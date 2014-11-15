var sinon 	= require('sinon');
var hierarchyStub = sinon.stub();
var flattenStub = sinon.stub();
var flattenCallbackStub = sinon.stub();
module.exports = {
	get: sinon.stub().returns({
		hierarchy: hierarchyStub,
		flatten: flattenStub.callsArgWith(1, null, 'flattened permissions')
	}),
	stubs: {
		PermissionGroup: {
			hierarchy: hierarchyStub,
			flatten: flattenStub
		}
	}
};