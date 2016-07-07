var app = angular.module('myApp', ['ngAnimate', 'ui.bootstrap']);
app.controller('customersCtrl', function($scope, $http) {

$scope.GetNames = GetNames;
$scope.SelectName = SelectName;
$scope.GetHistory = GetHistory;
$scope.RetrievePendings = RetrievePendings;
$scope.Insert = Insert;
$scope.$watch( 'selected',SelectedChanged );
$scope.selected = {Name:""};
$scope.Pwd='';

$scope.Selected = 0;
$scope.IsLoading=false;
$scope.Show = Show;
$scope.Initialize = Initialize;

function Initialize()
{
	$scope.Selected=1;
}
function GetNames()
{
	$scope.IsLoading = true;
	   $http.get("http://cekpulsa.ml//sql.php")
   .then(function (response) {
   console.log(response);
   $scope.names = response.data.records;
   $scope.IsLoading = false;
   });
	
}

function SelectName( name )
{
	$scope.IsLoading = true;
	var req = {
		method: 'POST',
		url: 'http://cekpulsa.ml//UserServices.php',
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
				$scope.List = records;
				$scope.IsLoading = false;
				}).catch(Error);
				
}

function GetHistory()
{
	var req = {
		method: 'POST',
		url: 'http://cekpulsa.ml//UserServices.php',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8'
			},
			data: { serviceName:"RetrieveAllTransaction", name: name }
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

function RetrievePendings()
{
	var req = {
		method: 'POST',
		url: 'http://cekpulsa.ml//UserServices.php',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8'
			},
			data: { serviceName:"RetrievePendings" }
			};
			
			$http(req).then(function (response) {
				console.log(response);
				var total=0;
				var records = response.data.records;
				for(var i=0;i<records.length;i++)
					total+=Number( records[ i ].Total );
				$scope.Total = total;
				$scope.List = records;}).catch(Error);
	
}

function SelectedChanged( val )
{
	if(typeof(val)=="object")
	{
		if( val.Name )
			SelectName( val.Name );
	}
}

function Insert()
{
	$scope.IsLoading = true;
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
		url: 'http://cekpulsa.ml//UserServices.php',
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
   $scope.IsLoading = false;
   }).catch(Error);
}

function Error(response)
{
	alert(response.toString());
	$scope.IsLoading = false;
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

