var Sequelize = require('sequelize');
var async = require('async');
var PermissionGroup = {
	attributes: {
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		lft: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		rgt: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		permissions: {
			type: 'association',
			method: 'hasMany',
			model: 'PermissionGroupPermission',
			as: 'permissions'
		}
	},
	options: {
		paranoid: true,
		classMethods: {
			// @todo: make this a transaction
			add: function(data, parentId, cb) {
				// var self = this;
				// var permissions = data.permissions;
				// delete data.permissions;
				// async.waterfall([
				// 	function(cb) {
				// 		if(!parentId)
				// 			return cb(null, 1, 2);

				// 		self
				// 		// .transaction()
				// 		.findOne(parentId)
				// 		.exec(function(err, parentGroup) {
				// 			if(err) return cb(err);
				// 			return cb(null, parentGroup.rgt, parentGroup.rgt+2)
				// 		});
				// 	},
				// 	function(lft, rgt, cb) {
				// 		// This is a major hack, instead of using UPDATE ... SET
				// 		// rgt += 2 in one query we are selecting all the necessary 
				// 		// records and updating each one individually. We have to do
				// 		// it the hacky way for now because waterline doesn't support
				// 		// values like this (rgt: { '+' : 2 }) yet.
				// 		// For more info see: https://github.com/balderdashy/waterline/issues/86
				// 		async.parallel([
				// 			function(cb) {
				// 				self.find({
				// 					rgt: { '>=' : lft }
				// 				}).exec(function(err, groups) {
				// 					if(err) return cb(err);
				// 					async.each(groups, function(group, cb) {
				// 						group.rgt += 2;
				// 						group.save(cb);
				// 					}, cb);
				// 				});
				// 			},
				// 			function(cb) {
				// 				self.find({
				// 					lft: { '>=' : lft }
				// 				}).exec(function(err, groups) {
				// 					if(err) return cb(err);
				// 					async.each(groups, function(group, cb) {
				// 						group.lft += 2;
				// 						group.save(cb);
				// 					}, cb);
				// 				});
				// 			}
				// 		], function(err) {
				// 			cb(err, lft, rgt);
				// 		});
				// 	},
				// 	function(lft, rgt, cb) {
				// 		data.lft = lft;
				// 		data.rgt = rgt;
				// 		self.create(data).exec(cb);
				// 	},
				// 	function(newGroup, cb){
				// 		if(!permissions) return cb(newGroup);
				// 		permissions.forEach(function(permission) {
				// 			permission.permissionGroupId = newGroup.id;
				// 		});

				// 		PermissionGroupPermission
				// 		// .transaction()
				// 		.create(permissions)
				// 		.exec(function(err, newPermissions) {
				// 			return cb(err, newGroup, newPermissions);
				// 		});
				// 	}
				// ], function(err, group, permissions) {
				// 	async.parallel({
				// 		group: function(cb) {
				// 			// if(err) return group.rollback(cb);
				// 			// return group.commit(cb);
				// 			cb();
				// 		},
				// 		permissions: function(cb) {
				// 			// async.each(permissions, function(permission, cb) {
				// 			// 	if(err) return; //permission.rollback(cb);
				// 			// 	return; //permission.commit(cb);
				// 			// }, cb);
				// 			cb();
				// 		}
				// 	}, function(err2) {
				// 		if(err) return cb(err);
				// 		if(err2) return cb(err2);
				// 		return cb(null, group, permissions);
				// 	});
				// });
			},
		}
	}
};

module.exports = PermissionGroup;