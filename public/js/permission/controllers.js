angular.module('permission.controllers', ['permission.data', 'permission.services'])

.controller('TreeCtrl', function($scope, $rootScope, $state, PermissionGroups) {
	var convert = function(rawNode) {
		var node = {
			text: rawNode.name,
			href: rawNode.id,
			permissionGroup: rawNode
		};
		if(rawNode.children && rawNode.children.length) {
			node.nodes = [];
			for(var i=0; i<rawNode.children.length; i++) {
				node.nodes.push(convert(rawNode.children[i]));
			}
		}
		return node;
	};
	var nodes = convert(PermissionGroups);
	$('#tree').treeview({
		data: [nodes],
		expandIcon: 'glyphicon glyphicon-chevron-right',
		collapseIcon: 'glyphicon glyphicon-chevron-down',
		emptyIcon: 'glyphicon glyphicon-th',
		nodeIcon:''
	});

	$('#tree').on('nodeSelected', function(e, node) {
		$state.go('permission-group', {id: node.href});
	});
})

.controller('HomeCtrl', function($scope) {

})

.controller('PermissionGroupCtrl', function($scope, $rootScope, $stateParams, AvailablePermissions, PermissionGroupAPI, PermissionGroupPermissionAPI) {
	$scope.availablePermissions = AvailablePermissions;
	$scope.groupPermissions = null;
	$scope.loading = true;
	$scope.permissionGroupId = $stateParams.id;

	$scope.checkInherit = function(pluginPath, permissionCode) {
		if(!$scope.groupPermissions)
			return 'active';
		if(!$scope.groupPermissions.hasOwnProperty(pluginPath))
			return 'active';
		if(!$scope.groupPermissions[pluginPath].hasOwnProperty(permissionCode))
			return 'active';
		if($scope.groupPermissions[pluginPath][permissionCode].permissionGroup.id != $stateParams.id)
			return 'active';
		return false;

	};

	$scope.checkGrant= function(pluginPath, permissionCode) {
		if(!$scope.groupPermissions)
			return false;
		if(!$scope.groupPermissions.hasOwnProperty(pluginPath))
			return false;
		if(!$scope.groupPermissions[pluginPath].hasOwnProperty(permissionCode))
			return false;
		if($scope.groupPermissions[pluginPath][permissionCode].permissionGroup.id != $stateParams.id)
			return false;
		return $scope.groupPermissions[pluginPath][permissionCode].value ? 'active' : false;
	};

	$scope.checkDeny = function(pluginPath, permissionCode) {
		if(!$scope.groupPermissions)
			return false;
		if(!$scope.groupPermissions.hasOwnProperty(pluginPath))
			return false;
		if(!$scope.groupPermissions[pluginPath].hasOwnProperty(permissionCode))
			return false;
		if($scope.groupPermissions[pluginPath][permissionCode].permissionGroup.id != $stateParams.id)
			return false;
		return $scope.groupPermissions[pluginPath][permissionCode].value ? false : 'active';
	};

	$scope.getValue = function(pluginPath, permissionCode) {
		if(!$scope.groupPermissions)
			return false;
		if(!$scope.groupPermissions.hasOwnProperty(pluginPath))
			return false;
		if(!$scope.groupPermissions[pluginPath].hasOwnProperty(permissionCode))
			return false;
		return $scope.groupPermissions[pluginPath][permissionCode].value ? true : false;
	};

	$scope.setPermission = function(permissionGroupId, pluginPath, permissionCode, value) {
		PermissionGroupPermissionAPI.post({
			groupId: permissionGroupId,
			pluginPath: pluginPath,
			permissionCode: permissionCode,
			value: value
		}).$promise.then(function(pg) {
			$scope.loading = false;
			$scope.groupPermissions = pg.data;
	    });
	};

	$scope.setGroup = function(groupId) {
		var nodes = $('#tree').data().plugin_treeview.nodes;

		var findNode = function(nodes) {
			for(var i in nodes) {
				if(nodes[i].href === groupId) return nodes[i];
			}

			for(var i in nodes) {
				if(nodes[i].permissionGroup.children.length) {
					var foundNode = findNode(nodes[i].permissionGroup.children);
					if(foundNode) return foundNode;
				}
			}

			return false;

		}

		var foundNode = findNode(nodes);
		if(!foundNode) throw 'Unable to find node with group id = '+groupId;

		$('.node-tree[data-nodeid="'+foundNode.nodeId+'"').click();

	};

	PermissionGroupAPI.get({ id: $stateParams.id }).$promise.then(function(pg) {
		$scope.loading = false;
		$scope.groupPermissions = pg.data;
    });
});
