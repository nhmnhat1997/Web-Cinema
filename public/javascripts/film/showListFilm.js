(() => {
  const app = angular.module('Cinema-Web')
  app.controller('showListController', ['$scope', 'apiService', function ($scope, apiService) {
    apiService.getFilms()
      .then(function (response) {
        console.log(response)
        $scope.listFilms = response.data.films
      })
  }])
})()
