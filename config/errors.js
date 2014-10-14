module.exports = {
	UNKNOWN_AUTH_TYPE: {
		code: 'UNKNOWN_AUTH_TYPE',
		message: 'Unknown auth type: {{type}}'
	},
	CHECKING_IF_REGISTERED: {
		code: 'CHECKING_IF_REGISTERED',
		message: 'There was an error while checking if someone has already registered with this email address.'
	},
	ALREADY_REGISTERED: {
		code: 'ALREADY_REGISTERED',
		message: 'It looks like someone has already registered with that username.'
	},
	ACCOUNT_CREATION: {
		code: 'ACCOUNT_CREATION',
		message: 'There was an error creating your account.'
	},
	USERNAME_REQUIRED: {
		code: 'USERNAME_REQUIRED',
		message: 'A username is required to register an account.'
	},
	USER_ID_REQUIRED: {
		code: 'USER_ID_REQUIRED',
		message: 'A user id is required when creating a new auth option.'
	},
	PASSWORD_REQUIRED: {
		code: 'PASSWORD_REQUIRED',
		message: 'A password is required to register an account.'
	},
	PASSWORD_CONFIRMATION_REQUIRED: {
		code: 'PASSWORD_CONFIRMATION_REQUIRED',
		message: 'A confirmation password is required to register an account.'
	},
	PASSWORD_MISMATCH: {
		code: 'PASSWORD_MISMATCH',
		message: 'The password and confirmation password did not match.'
	},
	UNKNOWN_PERMISSION_GROUP: {
		code: 'UNKNOWN_PERMISSION_GROUP',
		message: 'The specified permission group (id={{permissionGroupId}}) could not be found.'
	}
};