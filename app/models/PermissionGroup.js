var Sequelize = require('sequelize');
var async = require('async');
var _ = require('lodash');
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
			add: function(data, parentId, cb) {
				var self = this;
				var permissions = data.permissions;
				var t = null;
				delete data.permissions;
				async.waterfall([
					function(cb) {
						if(parentId) return cb(null, null, null);
						// If there is no parent id then the new group
						// should be a child of the root.
						self.findOrCreate(
							{
								where: { id: 1 },
								defaults: { name: 'root', lft: 1, rgt: 2 }
							}
						).then(function(rootGroup) {
							var rgt = rootGroup[0].getDataValue('rgt');
							cb(null, rgt, rgt+1);
						}, cb);
					},
					function(lft, rgt, cb) {
						self.sequelize.transaction().then(function(transaction) {
							t = transaction;
							cb(null, lft, rgt);
						});
					},
					function(lft, rgt, cb) {
						if(!parentId) return cb(null, lft, rgt);

						self.find({
							where: { id: parentId },
							attributes: ['lft', 'rgt']
						}, { transaction: t }).then(function(parentGroup) {
							if(!parentGroup) 
								return cb(config.errors.UNKNOWN_PERMISSION_GROUP);
							var rgt = parentGroup.getDataValue('rgt');
							cb(null, rgt, rgt+1);
						}, cb);
					},
					function(lft, rgt, cb) {
						async.parallel([
							function(cb) {
								var query = 'UPDATE permission_group SET rgt=rgt+2 WHERE rgt >= ?';
								self.sequelize.query(
									query,
									self.models.get('PermissionGroup'),
									{ transaction: t },
									[lft]
								).then(function() {
									cb();
								}, cb);
							},
							function(cb) {
								var query = 'UPDATE permission_group SET lft=lft+2 WHERE lft >= ?';
								self.sequelize.query(
									query,
									self.models.get('PermissionGroup'),
									{ transaction: t },
									[lft]
								).then(function() {
									cb();
								}, cb);
							}
						], function(err) {
							cb(err, lft, rgt);
						});
					},
					function(lft, rgt, cb) {
						data.lft = lft;
						data.rgt = rgt;
						self.create(data, { transaction: t }).then(function(newGroup) {
							cb(null, newGroup);
						}, cb);
					},
					function(newGroup, cb){
						if(!permissions || !permissions.length)
							return cb(null, newGroup, []);

						permissions.forEach(function(permission) {
							permission.permissionGroupId = newGroup.id;
						});

						self.models.get('PermissionGroupPermission')
						.bulkCreate(permissions, { transaction: t })
						.then(function(newPermissions) {
							return cb(null, newGroup, newPermissions);
						}, cb);
					}
				], function(err, group, permissions) {
					if(!err) {
						t.commit().then(function() {
							cb(null, group, permissions);
						}, function(err) {
							cb(err);
						});
						return;
					}

					return t.rollback().then(function() {
						cb(err);
					}, cb);
				});
			},

			hierarchy: function(parentId, cb) {
				var self = this;
				if(_.isFunction(parentId)) {
					cb = parentId;
					parentId = 1;
				}
				var query = '\
				SELECT node.*\
				FROM permission_group AS node\
				JOIN permission_group AS parent\
				WHERE parent.id = ?\
				ORDER BY node.lft\
				';
				self.sequelize.query(
					query,
					self.models.get('PermissionGroup'),
					{},
					[parentId]
				).then(function(results) {
					if(results.length == 0) return false;
					if(results.length == 1) {
						results[0].children = [];
						return results[0];
					}
					var root = results[0];
					root.children = [];
					var parent = root;
					for(var i=1; i<results.length; i++) {
						var target = results[i];

						// Move up the tree
						while(target.getDataValue('rgt') > parent.rgt)
							parent = parent.parent;

						target.parent = parent;
						target.children = [];
						parent.children.push(target);

						// Move down the tree
						parent = target;
					}
					cb(null, root);

				}, cb);
			}
		},

		instanceMethods: {
			toObject: function() {
				var obj = this.toJSON();
				if(this.children) {
					obj.children = [];
					this.children.forEach(function(child) {
						obj.children.push(child.toObject());
					});
				}
				return obj;
			}
		}
	}
};

module.exports = PermissionGroup;