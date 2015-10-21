VirtualMalte.NameController = function ($scope) {
	$scope.name = localStorage.name || 'Noname';

	$scope.$watch('name', function(newName) {
		localStorage.name = newName;
	});
};