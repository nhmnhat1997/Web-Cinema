let imageFile
const app = angular.module('Cinema-Web')
app.controller('createController', ['$scope', 'apiService', function ($scope, apiService) {
  $('.loader').fadeIn(500)
  $scope.listGenreFilms = ['Hành động', 'Tình cảm', 'Kinh dị', 'Hoạt hình', 'Giả tưởng']
  let userid = $('#user-id').text()
  $('#datePicker').datepicker({
    format: 'dd/mm/yyyy',
    todayHighlight: true,
    orientation: 'bottom auto',
    autoclose: true
  })
  $scope.formTitle = 'Tạo phim mới'
  $scope.buttonTitle = 'Tạo phim'
  $scope.filmGenre = $scope.listGenreFilms[0]
  $scope.filmName = ''
  $scope.filmContent = ''
  $('#datePicker').datepicker('setDate', new Date())

  let filmId = $('#film-id').text().trim()
  if (filmId) {
    $scope.formTitle = 'Sửa phim'
    $scope.buttonTitle = 'Sửa phim'
    apiService.getFilm(filmId)
      .then(function (response) {
        if (response.status == 200) {
          if (userid !== response.data.film.creatorId) {
            window.location.href = '/'
          }
          $scope.film = response.data.film
          $scope.filmName = $scope.film.name
          $scope.filmGenre = $scope.film.genre
          $scope.filmContent = $scope.film.content
          $('#datePicker').datepicker('setDate', new Date($scope.film.releaseDate))
          $('.loader').fadeOut(500)
        }
      })
  }
  document.getElementById('fileInput').addEventListener('change', (e) => {
    filePicked = e.target.files[0]
    $('#imageFilm').css('opacity', 1)
  }, false)
  if (userid) {
    apiService.getUser(userid)
      .then(function (response) {
        $scope.user = response.data.user
        $('.loader').fadeOut(500)
      })
  }

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

  $scope.goBackHome = function () {
    if (filmId) {
      window.location.href = '/phim/' + filmId
    } else {
      window.location.href = '/'
    }
  }

  $scope.clickUploadImage = function () {
    document.getElementById('fileInput').click()
  }

  $scope.clickUploadFilm = function () {
    if (!$scope.filmName) {
      document.getElementById('filmName').setCustomValidity('Vui lòng nhập tên phim')
      return
    } else {
      document.getElementById('filmName').setCustomValidity('')
    }
    var date = new Date($('#datePicker').datepicker('getDate'))
    let data = {
      _id: filmId,
      name: $scope.filmName,
      genre: $scope.filmGenre,
      releaseDate: date.getTime(),
      content: $scope.filmContent,
      creatorId: userid
    }

    var formData = new FormData()
    formData.append('file', imageFile)
    formData.append('_id', data._id)
    formData.append('name', data.name)
    formData.append('genre', data.genre)
    formData.append('releaseDate', data.releaseDate)
    formData.append('content', data.content)
    formData.append('creatorId', data.creatorId)

    // Use jQuery.ajax method
    $.ajax('/api/cinema', {
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        console.log(data)
        if (filmId) {
          $scope.notiMessage = 'Sửa phim thành công'
          document.getElementById('SuccessDialog').style.display = 'block'
        } else {
          $scope.notiMessage = 'Tạo phim thành công'
          document.getElementById('SuccessDialog').style.display = 'block'
        }
        $scope.$apply()
      },
      error: function (err) {
        err && console.log(err)
      }
    })
  }
}])

function onChangeImage (event) {
  var selectedFile = event.target.files[0]
  var getImagePath = URL.createObjectURL(event.target.files[0])
  $('#imageFilm').attr('src', getImagePath)
  imageFile = selectedFile
  console.log(imageFile)
}

function timeStampToString (timestamp) {
  var date = new Date(timestamp)
  var str = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
  return str
}
