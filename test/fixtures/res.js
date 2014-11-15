var sinon 	= require('sinon');
var apiSendStub = sinon.stub();
var api = {
	setData: sinon.stub().returns({
		send: apiSendStub
	}),
	setError: sinon.stub().returns({
		send: apiSendStub
	}),
	send: apiSendStub
};
module.exports = {
	api: api,
	stubs: {
		api: {
			setData: api.setData,
			setError: api.setError,
			send: apiSendStub
		}
	}
};