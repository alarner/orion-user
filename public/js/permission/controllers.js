angular.module('permission.controllers', ['permission.data'])

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
		emptyIcon: '',
		nodeIcon:''
	});

	$('#tree').on('nodeSelected', function(e, node) {
		// $rootScope.$emit('GROUP_SELECTED', node.permissionGroup);
		$state.go('permission-group', {id: node.href});
	});
})

.controller('HomeCtrl', function($scope) {

})

.controller('PermissionGroupCtrl', function($scope, $rootScope, $stateParams) {
	// var permissionGroup = null;
	// $rootScope.$on('GROUP_SELECTED', function(e, group) {
	// 	console.log('test');
	// 	$state.go('permission-group', {id: group.id});
	// 	permissionGroup = group;
	// });
});
