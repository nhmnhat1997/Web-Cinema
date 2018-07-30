(() => {
  const app = angular.module('Cinema-Web')
  var vietnameseToAlias = function (alias) {
    if (alias == null) return null
    var str = alias
    str = str.toLowerCase()
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    return str
  }
  app.filter('filmFilter', function () {
    return function (items) {
      if (!items) { return [] }
      let result = items.filter(function (element, index, array) {
        return vietnameseToAlias(element.name).includes(vietnameseToAlias($('#input-search').val())) ||
        vietnameseToAlias(element.genre).includes(vietnameseToAlias($('#input-search').val())) ||
        vietnameseToAlias(element.content).includes(vietnameseToAlias($('#input-search').val())) ||
        COMMON.timeStampToString(element.releaseDate).includes(vietnameseToAlias($('#input-search').val()))
      })
      console.log(result)
      return result
    }
  })
  app.controller('showListController', ['$scope', 'apiService', function ($scope, apiService) {
    $('.loader').fadeIn(500)
    let userid = $('#user-id').text()
    $scope.resultList = []
    $scope.clickSignOut = function () {
      document.getElementById('LogoutDialog').style.display = 'block'
    }

    $scope.goSignOut = function () {
      apiService.signout()
        .then(function (response) {
          window.location.href = '/'
        })
    }

    $scope.cancelDialog = function () {
      document.getElementById('LogoutDialog').style.display = 'none'
    }
    $scope.toggleInputSearch = () => {
      $('#input-search').animate({ width: 'toggle' }, 300)
    }

    if (userid) {
      apiService.getUser(userid)
        .then(function (response) {
          $scope.user = response.data.user
        })
    }
    apiService.getFilms()
      .then(function (response) {
        $scope.listFilms = response.data.films
        $('.loader').fadeOut(500)
      })
  }])
})()
