var app = angular.module('myApp', []);
app.controller('customersCtrl', function($scope, $http) {
   $http.get("http://tpulsa.com/sql.php")
   .then(function (response) {
   console.log(response);
   $scope.names = response.data.records;});
});