var async = require('async');
var PermissionGroup = {
	attributes: {
		name: {
			type: 'string',
			required: true
		},
		lft: {
			type: 'integer',
			required: true
		},
		rgt: {
			type: 'integer',
			required: true
		},
		permissions: {
			collection: 'PermissionGroupPermission',
			via: 'permissionGroupId'
		},
		deleted: {
			type: 'boolean',
			required: true,
			defaultsTo: false
		},
	},
	// @todo: make this a transaction
	add: function(data, parentId, cb) {
		var self = this;
		var permissions = data.permissions;
		delete data.permissions;
		async.waterfall([
			function(cb){
				if(!parentId)
					return cb(null, 1, 2);

				self
				.transaction()
				.findOne(parentId)
				.done(function(err, parentGroup) {
					if(err) return cb(err);
					return cb(null, parentGroup.rgt, parentGroup.rgt+2)
				});
			},
			function(lft, rgt, cb){
				self.update({
					rgt: { '>=' : lft }
				}, {
					rgt: { '+' : [ 2 ] }
				}).done(function(err) {
					if(err) return cb(err);
					self.update({
						lft: { '>=' : lft }
					}, {
						lft: { '+' : [ 2 ] }
					}).done(function(err) {
						return cb(err, lft, rgt);
					});
				});
			},
			function(lft, rgt, cb){
				data.lft = lft;
				data.rgt = rgt;
				self.create(data).done(cb);
			},
			function(newGroup, cb){
				if(!permissions) return cb(newGroup);
				permissions.forEach(function(permission) {
					permission.permissionGroupId = newGroup.id;
				});
				PermissionGroupPermission
				.transaction()
				.create(permissions)
				.done(function(err, newPermissions) {
					return cb(err, newGroup, newPermissions);
				});
			}
		], function(err, group, permissions) {
			async.parallel({
				group: function(cb) {
					if(err) return group.rollback(cb);
					return group.commit(cb);
				},
				permissions: function(cb) {
					async.each(permissions, function(permission, cb) {
						if(err) return permission.rollback(cb);
						return permission.commit(cb);
					}, cb);
				}
			}, function(err2) {
				if(err) return cb(err);
				if(err2) return cb(err2);
				return cb(null, group, permissions);
			});
		});
	}
};

module.exports = PermissionGroup;