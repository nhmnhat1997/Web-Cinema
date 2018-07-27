let imageFile
let currentId
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
      document.getElementById('EditNameDialog').style.display = 'none'
      document.getElementById('ChangePasswordDialog').style.display = 'none'
      document.getElementById('ErrorDialog').style.display = 'none'
    }

    $scope.openEditDialog = function () {
      $scope.newName = $scope.user.name
      document.getElementById('EditNameDialog').style.display = 'block'
    }

    $scope.openChangePassDialog = function () {
      document.getElementById('ChangePasswordDialog').style.display = 'block'
    }

    $scope.changeInfo = function () {
      if (!$scope.newName) {
        document.getElementById('newName').setCustomValidity('Vui lòng nhập tên mới.')
        return
      } else {
        document.getElementById('newName').setCustomValidity('')
      }
      apiService.editInfo(userid, {name: $scope.newName})
        .then(function (response) {
          $scope.user = response.data.user
          $scope.user.name = response.data.user.name
          $('#headerUserName').text(response.data.user.name)
          console.log($scope.user)
          document.getElementById('EditNameDialog').style.display = 'none'
        })
    }

    $scope.changePassword = function () {
      if (!$scope.currentPass) {
        alert('Vui lòng nhập mật khẩu hiện tại.')
        return
      }
      if (!$scope.newPass) {
        alert('Vui lòng nhập mật khẩu mới.')
        return
      }
      if (!$scope.reenterNewPass) {
        alert('Vui lòng nhập lại mật khẩu mới.')
        return
      }
      if ($scope.reenterNewPass !== $scope.newPass) {
        alert('2 mật khẩu mới không trùng nhau. Vui lòng kiểm tra lại')
        return
      }
      let data = {
        currentPass: $scope.currentPass,
        newPass: $scope.newPass
      }
      apiService.changePassword(userid, data)
        .then(function (response) {
          console.log(response)
          if (response.data.status == 403) {
            alert(response.data.errorMessage)
          } else if (response.data.status == 200) {
            $scope.user = response.data.user
            console.log($scope.user)
            document.getElementById('ChangePasswordDialog').style.display = 'none'
            $scope.error = 'Đổi mật khẩu thành công'
            document.getElementById('ErrorDialog').style.display = 'block'
          } else {

          }
        })
    }
    document.getElementById('fileInput').addEventListener('change', (e) => {
      filePicked = e.target.files[0]
      $('#imageFilm').css('opacity', 1)
    }, false)

    $scope.clickUploadAvatar = function () {
      document.getElementById('fileInput').click()
    }

    if (userid) {
      currentId = userid
      apiService.getUser(userid)
        .then(function (response) {
          $scope.user = response.data.user
          console.log(response.data)
        })
    }
  }])
})()
function onChangeImage (event) {
  var selectedFile = event.target.files[0]
  var getImagePath = URL.createObjectURL(event.target.files[0])
  $('#imageFilm').attr('src', getImagePath)
  imageFile = selectedFile
  console.log(imageFile)
  beginUpload(currentId)
}
function beginUpload (userid) {
  if (!imageFile) { return }
  var formData = new FormData()
  formData.append('file', imageFile)
  console.log(imageFile)
  $.ajax('/api/user/' + userid + '/change-avatar', {
    method: 'PUT',
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      console.log(data)
      alert('Đổi avatar thành công')
    },
    error: function (err) {
      err && console.log(err)
    }
  })
}
