// @todo: fix status codes
module.exports = {
	UNKNOWN_AUTH_TYPE: {
		code: 'UNKNOWN_AUTH_TYPE',
		message: 'Unknown auth type: {{type}}',
		status: 400
	},
	CHECKING_IF_REGISTERED: {
		code: 'CHECKING_IF_REGISTERED',
		message: 'There was an error while checking if someone has already registered with this email address.',
		status: 500
	},
	ALREADY_REGISTERED: {
		code: 'ALREADY_REGISTERED',
		message: 'It looks like someone has already registered with the username "{{username}}".',
		status: 400
	},
	ACCOUNT_CREATION: {
		code: 'ACCOUNT_CREATION',
		message: 'There was an error creating your account.',
		status: 500
	},
	USERNAME_REQUIRED: {
		code: 'USERNAME_REQUIRED',
		message: 'A username is required to register an account.',
		status: 400
	},
	USER_ID_REQUIRED: {
		code: 'USER_ID_REQUIRED',
		message: 'A user id is required when creating a new auth option.',
		status: 400
	},
	PASSWORD_REQUIRED: {
		code: 'PASSWORD_REQUIRED',
		message: 'A password is required to register an account.',
		status: 400
	},
	PASSWORD_CONFIRMATION_REQUIRED: {
		code: 'PASSWORD_CONFIRMATION_REQUIRED',
		message: 'A confirmation password is required to register an account.',
		status: 400
	},
	PASSWORD_MISMATCH: {
		code: 'PASSWORD_MISMATCH',
		message: 'The password and confirmation password did not match.',
		status: 400
	},
	UNKNOWN_PERMISSION_GROUP: {
		code: 'UNKNOWN_PERMISSION_GROUP',
		message: 'The specified permission group (id={{permissionGroupId}}) could not be found.',
		status: 400
	},
	MISSING_PERMISSION_GROUP_ID: {
		code: 'MISSING_PERMISSION_GROUP_ID',
		message: 'The permission group id must be passed as a parameter to this request.',
		status: 400
	},
	MISSING_PERMISSION_PLUGIN_PATH: {
		code: 'MISSING_PERMISSION_PLUGIN_PATH',
		message: 'The plugin path must be passed as a parameter to this request.',
		status: 400
	},
	MISSING_PERMISSION_CODE: {
		code: 'MISSING_PERMISSION_CODE',
		message: 'The permission code must be passed as a parameter to this request.',
		status: 400
	},
	MISSING_PERMISSION_VALUE: {
		code: 'MISSING_PERMISSION_VALUE',
		message: 'The permission value must be passed in the body of this request.',
		status: 400
	},
	INVALID_PERMISSION_VALUE: {
		code: 'INVALID_PERMISSION_VALUE',
		message: 'The permission value must "inherit", "grant" or "deny".',
		status: 400
	},
	UNKNOWN_ERROR: {
		code: 'UNKNOWN_ERROR',
		message: 'An unknown error occurred.',
		status: 500
	},
	MAX_FAILED_ATTEMPTS: {
		code: 'MAX_FAILED_ATTEMPTS',
		message: 'You have made too many ({{max}}) failed log in attempts in the last {{timeInterval}} minutes.',
		status: 500
	},
	UNKNOWN_IDENTIFIER: {
		code: 'UNKNOWN_IDENTIFIER',
		message: 'We can\'t find the username you entered. Please try a different one.',
		status: 400
	},
	BCRYPT: {
		code: 'BCRYPT',
		message: 'There was a problem with bcrypt: {{error}}',
		status: 500
	},
	INVALID_PASSWORD: {
		code: 'INVALID_PASSWORD',
		message: 'The password you entered is not correct.',
		status: 400
	},
	PASSWORD_GENERATION: {
		code: 'PASSWORD_GENERATION',
		message: 'An error occured while generating the password: {{error}}',
		status: 500
	}
};