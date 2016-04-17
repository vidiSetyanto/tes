var app = angular.module('myApp', ['ngAnimate', 'ui.bootstrap']);
app.controller('customersCtrl', function($scope, $http) {

$scope.GetNames = GetNames;
$scope.SelectName = SelectName;

$scope.$watch( 'selected',SelectedChanged );

function GetNames()
{
	   $http.get("http://tpulsa.com/sql.php")
   .then(function (response) {
   console.log(response);
   $scope.names = response.data.records;});
	
}

function SelectName( name )
{
	var req = {
 method: 'POST',
 url: 'http://tpulsa.com/UserServices.php',
 headers: {
   'Content-Type': 'application/json; charset=UTF-8'
 },
 data: { name: name }
}

$http(req).then(function (response) {
   console.log(response);
   var total=0;
   var records = response.data.records;
   for(var i=0;i<records.length;i++)
	   total+=Number( records[ i ].Amount );
   $scope.Total = total;
   $scope.List = records;});
}

function SelectedChanged( val )
{
	if(typeof(val)=="object")
	{
		SelectName( val.Name );
	}
}

});
app.controller('TypeaheadCtrl', function($scope, $http) {

  var _selected;

  $scope.selected = undefined;

  $scope.ngModelOptionsSelected = function(value) {
    if (arguments.length) {
      _selected = value;
    } else {
      return _selected;
    }
  };

  $scope.modelOptions = {
    debounce: {
      default: 500,
      blur: 250
    },
    getterSetter: true
  };

  
});

