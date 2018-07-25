(() => {
  const app = angular.module('Cinema-Web')
  app.controller('signupController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.userName = ''
    $scope.email = ''
    $scope.password = ''
    $scope.clickSignUp = function () {
      if ($scope.userName.length == 0) {
        document.getElementById('userName').setCustomValidity('Vui lòng nhập tên của bạn')
        return
      }
      if ($scope.email.length == 0) {
        document.getElementById('email').setCustomValidity('Vui lòng nhập email của bạn')
        return
      } else if (!COMMON.isEmailValid($scope.email)) {
        document.getElementById('email').setCustomValidity('Email không đúng định dạng')
        return
      }
      if ($scope.password.length == 0) {
        document.getElementById('password').setCustomValidity('Vui lòng nhập mật khẩu')
        return
      }
      if ($scope.reEnterPassword.length == 0) {
        document.getElementById('reEnterPassword').setCustomValidity('Vui lòng nhập mật khẩu lần 2')
        return
      }

      if (!($scope.password === $scope.reEnterPassword)) {
        document.getElementById('reEnterPassword').setCustomValidity('2 mật khẩu không trùng khớp, vui lòng kiểm tra lại.')
        return
      }

      $scope.goBackHome = function () {
        window.location.href = '/'
      }

      $scope.closeDialog = function() {
        document.getElementById('ErrorDialog').style.display = 'none'
      }

      let data = {
        name: $scope.userName,
        email: $scope.email,
        password: $scope.password
      }
      console.log(data)
      apiService.signup(data)
        .then(function (response) {
          console.log(response.message)
          console.log(response.data.status)
          if (response.data.status == 200) {
            document.getElementById('SuccessDialog').style.display = 'block'
          }
          else if (response.data.status != 200) {
            $scope.error = response.data.errorMessage
            document.getElementById('ErrorDialog').style.display = 'block'
          }
        })
    }
  }])
})()
