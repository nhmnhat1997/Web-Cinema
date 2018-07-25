(() => {
  const app = angular.module('Cinema-Web')
  app.controller('showListController', ['$scope', 'apiService', function ($scope, apiService) {
    let userid = $('#user-id').text()
    $scope.clickSignOut = function () {
      apiService.signout()
        .then(function (response) {
          console.log(response.data)
          window.location.href = '/'
        })
    }
    if (userid) {
      apiService.getUser(userid)
        .then(function (response) {
          $scope.user = response.data.user
          console.log(response.data)
        })
    }
    apiService.getFilms()
      .then(function (response) {
        console.log(response)
        $scope.listFilms = response.data.films
      })
  }])
})()
