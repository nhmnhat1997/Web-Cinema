(() => {
  const app = angular.module('Cinema-Web')
  app.controller('detailController', ['$scope', 'apiService', function ($scope, apiService) {
    let id = $('#film-id').text()
    apiService.getFilm(id)
      .then(function (response) {
        console.log(response.message)
        if (response.status == 200) {
          console.log(response)
          $scope.film = response.data.film
        }
      })
  }
  ])
})()
