(() => {
  const app = angular.module('Cinema-Web')
  app.controller('createController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.listGenreFilms = ['Hành động', 'Tình cảm', 'Kinh dị', 'Hoạt hình', 'Giả tưởng']
    $scope.filmGenre = $scope.listGenreFilms[0]
    $scope.filmName = ''
    $scope.filmContent = ''
    $('#datePicker').datepicker({
      format: 'dd/mm/yyyy',
      todayHighlight: true,
      orientation: 'bottom auto',
      autoclose: true
    })
    $('#datePicker').datepicker('setDate', new Date())
    console.log(timeStampToString($('#datePicker').datepicker('getDate')))

    document.getElementById('fileInput').addEventListener('change', (e) => {
      filePicked = e.target.files[0]
      $('#imageFilm').css('opacity', 1)
    }, false)

    let userid = $('#user-id').text()
    if (userid) {
      apiService.getUser(userid)
        .then(function (response) {
          $scope.user = response.data.user
          // $('.loading').hide()
          console.log(response.data)
        })
    }

    $scope.clickSignOut = function () {
      apiService.signout()
        .then(function (response) {
          console.log(response.data)
          window.location.href = '/'
        })
    }

    $scope.goBackHome = function () {
      window.location.href = '/'
    }

    $scope.clickUploadImage = function () {
      document.getElementById('fileInput').click()
    }

    $scope.clickUploadFilm = function () {
      if ($scope.filmName.length === 0) {
        document.getElementById('filmName').setCustomValidity('Vui lòng nhập tên phim')
        return
      } else {
        document.getElementById('filmName').setCustomValidity('')
      }
      var date = new Date($('#datePicker').datepicker('getDate'))
      let data = {
        name: $scope.filmName,
        genre: $scope.filmGenre,
        releaseDate: date.getTime(),
        content: $scope.filmContent,
        creatorId: userid
      }
      apiService.createFilm(data)
        .then(function (response) {
          console.log(response.message)
          if (response.status == 200) {
            document.getElementById('SuccessDialog').style.display = 'block'
          }
        })
    }
  }])
})()

function readURL (input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader()
    reader.onload = function (e) {
      $('#imageFilm').attr('src', e.target.result)
    }
    reader.readAsDataURL(input.files[0])
  }
}

function timeStampToString (timestamp) {
  var date = new Date(timestamp)
  var str = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
  return str
}
