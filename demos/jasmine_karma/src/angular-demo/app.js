angular.module('app', [])
  .controller('testCtrl', function ($scope, $http) {
    $scope.pageTitle = 'This is the page title!';
    $scope.infos = [];
    $scope.getInfo = getInfo;

    
    function getInfo() {
      $http.get('./mock.json')
        .then(function (data) {
          $scope.infos = data;
        });
    }
  });