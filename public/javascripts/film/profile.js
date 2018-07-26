(() => {
  const app = angular.module('Cinema-Web')
  app.controller('profileController', ['$scope', 'apiService', function ($scope, apiService) {
    let userid = $('#user-id').text()
    $scope.clickSignOut = function () {
      document.getElementById('LogoutDialog').style.display = 'block'
    }

    $scope.goSignOut = function () {
      apiService.signout()
        .then(function (response) {
          console.log(response.data)
          window.location.href = '/'
        })
    }

    $scope.cancelDialog = function () {
      document.getElementById('LogoutDialog').style.display = 'none'
    }
    if (userid) {
      apiService.getUser(userid)
        .then(function (response) {
          $scope.user = response.data.user
          console.log(response.data)
        })
    }
  }])
})()
