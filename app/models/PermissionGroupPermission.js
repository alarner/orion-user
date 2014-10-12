module.exports = {
	attributes: {
		pluginPath: {
			type: 'string',
			required: false,
			defaultsTo: ''
		},
		code: {
			type: 'string',
			required: true
		},
		value: {
			type: 'boolean',
			required: true
		}
	}
};