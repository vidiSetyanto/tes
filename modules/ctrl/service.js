var app = angular.module('myApp', ['ngAnimate', 'ui.bootstrap']);
app.controller('customersCtrl', function($scope, $http) {

$scope.GetNames = GetNames;
$scope.SelectName = SelectName;
$scope.Insert = Insert;
$scope.$watch( 'selected',SelectedChanged );
$scope.selected = {Name:""};
$scope.Pwd='';

$scope.Show = Show;

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
 data: { serviceName:"RetrieveTransaction", name: name }
}

$http(req).then(function (response) {
   console.log(response);
   var total=0;
   var records = response.data.records;
   for(var i=0;i<records.length;i++)
	   total+=Number( records[ i ].Amount );
   $scope.Total = total;
   $scope.List = records;}).catch(Error);
}

function SelectedChanged( val )
{
	if(typeof(val)=="object")
	{
		SelectName( val.Name );
	}
}

function Insert()
{
	console.log($scope.selected,$scope.Amount, $scope.Description);
	if( !$scope.selected.ID )
	{
		Error( "User " + $scope.selected + " Not Found !!" );
		return;
	}
	if( !$scope.Amount )
	{
		Error( "Amount cant be null !!" );
		return;
	}
	var req = {
		method: 'POST',
		url: 'http://tpulsa.com/UserServices.php',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8'
			},
			data: { serviceName: "AddTransaction", datas:{name:$scope.selected, amount:$scope.Amount, description: $scope.Description, pwd:$scope.Pwd} }
			}

$http(req).then(function (response) {
   console.log(response);
   $scope.Amount="";
   $scope.Description="";
   SelectedChanged($scope.selected);
   alert( "inserted" );
   }).catch(Error);
}

function Error(response)
{
	alert(response.toString());
}

function Show()
{
	return $scope.Pwd.length==4;
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

