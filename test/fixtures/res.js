var sinon 	= require('sinon');
module.exports = function() {
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

	this.api = api;
	this.stubs = {
		api: {
			setData: api.setData,
			setError: api.setError,
			send: apiSendStub
		}
	};
};