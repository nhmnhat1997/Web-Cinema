const POS_DOMAIN = 'localhost:3000'
const apiVersion = '/api/'

angular.module('Cinema-Web', []).factory('apiService', ['$http', function ($http) {
  return {
    createFilm: function (data) {
      return $http.post('/api/cinema', data)
    },
    getFilms: function () {
      return $http.get('/api/cinema')
    },
    getFilm: function (id) {
      return $http.get('/api/cinema/' + id)
    },
    signup: function (data) {
      return $http.post('/api/auth/signup', data)
    },
    signin: function (data) {
      return $http.post('/api/auth/signin', data)
    },
    getUser: function (id) {
      return $http.get('/api/user/' + id)
    },
    signout: function () {
      return $http.get('/api/auth/signout')
    }
  }
}])
