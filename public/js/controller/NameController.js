VirtualMalte.NameController = function ($scope) {
	$scope.name = localStorage.name;

	$scope.$watch('name', function(newName) {
		localStorage.name = newName;
	});
};