angular.module('app', [])
  .controller('testCtrl', function ($scope, $http) {
    $scope.pageTitle = 'This is the page title!';
    $scope.infos = [];
    $scope.getInfo = getInfo;
    
    function getInfo() {
      $http.get('./mock.json')
        .then(function (data) {
          $scope.infos = data.data;
          $scope.infos[1] && ($scope.infos[1].checked = true); //check the 2nd item
        });
    }

    // setTimeout(function () {
    //   alert('this page should contains an alert');
    // }, 1000);
  });
  angular.bootstrap(document, ['app']);