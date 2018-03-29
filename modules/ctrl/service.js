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
$scope.SelectedPage=1;
$scope.PageSize=5;
$scope.List=[];

$scope.UpdatePage=UpdatePage;

$scope.$watch("PageSize",GetPagedData);
function Initialize()
{
	$scope.Selected=1;
}
function GetNames()
{
	$scope.IsLoading = true;
	   $http.get("http://cekpulsa.hol.es//sql.php")
   .then(function (response) {
   //console.log(response);
   $scope.names = response.data.records;
   $scope.IsLoading = false;
   });
	
}

function SelectName( name )
{
	$scope.IsLoading = true;
	var req = {
		method: 'POST',
		url: 'http://cekpulsa.hol.es//UserServices.php',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8'
			},
			data: { serviceName:"RetrieveTransaction", name: name }
			}

			$http(req).then(function (response) {
				console.log(response);
				$scope.SelectedPage=1;
				var total=0;
				var records = response.data.records;
				for(var i=0;i<records.length;i++)
					total+=Number( records[ i ].Amount );
				$scope.Total = total;
				$scope.List = records;
				GetPagedData();
				$scope.IsLoading = false;
				}).catch(Error);
				
}

function GetPagedData()
{
	var paged={};
	var numberOfPage=Clone($scope.PageSize);
	var interval = Clone(numberOfPage);
	var currentPage=1;
	UpdatePage(currentPage);
	for(var i=0;i<$scope.List.length;i++)
	{$scope.List[i]=ConvertToAppFormat($scope.List[i]);
		if(!paged[currentPage])
		{
			paged[currentPage]=[$scope.List[i]];
			continue;
		}
		paged[currentPage].push($scope.List[i]);
		if(i==interval-1)
		{
			currentPage+=1;
			interval+=eval(numberOfPage);
		}
		
	}
	$scope.PagedData=paged;
	function Clone(a)
	{
		return a;
	}
}

function ConvertToAppFormat(data)
{
	var serverTimeZone=-4;
	Date.prototype.ToLocal = function() {    
	var d = new Date();
    var n = d.getTimezoneOffset();
	var diff=n+(serverTimeZone*60);
	console.log("current:"+n+"\n diff  with server:"+diff);
	this.setTime(this.getTime() - (diff*60*1000)); 
   return this;   
	}
	var date = new Date(data.Date);
	console.log(1+" "+date);
	data.Date=date.ToLocal();
	console.log(data);
	return data;
}

function UpdatePage(no)
{
	$scope.SelectedPage=no;
}

function GetHistory()
{
	var req = {
		method: 'POST',
		url: 'http://cekpulsa.hol.es//UserServices.php',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8'
			},
			data: { serviceName:"RetrieveAllTransaction", name: name }
}

$http(req).then(function (response) {
   var total=0;
   var records = response.data.records;
   for(var i=0;i<records.length;i++)
	   total+=Number( records[ i ].Amount );
   $scope.Total = total;
   for(var i=0;i<records.length;i++)
	   records[i]=ConvertToAppFormat(records[i]);
   $scope.List = records;}).catch(Error);
}

function RetrievePendings()
{
	var req = {
		method: 'POST',
		url: 'http://cekpulsa.hol.es//UserServices.php',
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
		url: 'http://cekpulsa.hol.es//UserServices.php',
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

