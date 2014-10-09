module.exports = {
	resetPasswordKey: {
		length: 20,
		lifetimeInHours: 48
	},
	emails: {
		type: 'SMTP',
		params: {
			service: 'SendGrid',
			auth: {
				user: '',
				pass: ''
			}
		},
		registration: {
			from: {
				name: 'Aaron Larner',
				email: 'anlarner@gmail.com'
			},
			subject: 'Hello {{ name }}, welcome to {{ product }}!',
			templatePath: ''
		},
		passwordReset: {
			from: {
				name: 'Aaron Larner',
				email: 'anlarner@gmail.com'
			},
			subject: 'It looks like you forgot your password',
			templatePath: ''
		}
	},
	register: {
		redirect: '/',
		autoLogin: true
	}
};