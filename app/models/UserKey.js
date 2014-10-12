// module.exports = {

// 	type: {
// 		EMAIL_VERIFICATION: 1,
// 		RESET_PASSWORD: 2
// 	},

// 	attributes: {
// 		'key': {
// 			type: 'string',
// 			primaryKey: true
// 		},
// 		'userId': {
// 			type: 'integer',
// 			required: true
// 		},
// 		'type': {
// 			type: 'integer',
// 			required: true
// 		},
// 		'expiresAt': {
// 			type: 'datetime',
// 			required: false
// 		},
// 		'usedAt': {
// 			type: 'datetime',
// 			required: false
// 		},

// 		use: function(cb) {
// 			this.usedAt = new Date();
// 			this.save(cb);
// 		}
// 	}
// };
