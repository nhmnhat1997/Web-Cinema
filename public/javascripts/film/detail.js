(() => {
  const app = angular.module('Cinema-Web')
  app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
    let id = $('#film-id').text()
    let userid = $('#user-id').text()
    $scope.isCreator = false
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
          // $('.loading').hide()
          console.log(response.data)
          
        })
    }
    apiService.getFilm(id)
      .then(function (response) {
        console.log(response.message)
        if (response.status == 200) {
          console.log(response)
          $scope.film = response.data.film
          if (userid === $scope.film.creatorId) {
            $scope.isCreator = true
          }
        }
      })
    $scope.clickEditFilm = function () {
      window.location.href = '/phim/' + $scope.film._id + '/sua-phim'
    }
  }
  ])
})()
