(() => {
  const app = angular.module('Cinema-Web')
  app.controller('signinController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.userName = ''
    $scope.email = ''
    $scope.password = ''
    $scope.clickSignIn = function () {
      if (!$scope.email) {
        document.getElementById('email').setCustomValidity('Vui lòng nhập email của bạn')
        return
      } else {
        document.getElementById('email').setCustomValidity('')
      }
      if (!COMMON.isEmailValid($scope.email)) {
        document.getElementById('email').setCustomValidity('Email không đúng định dạng')
        return
      } else {
        document.getElementById('email').setCustomValidity('')
      }
      if (!$scope.password) {
        document.getElementById('password').setCustomValidity('Vui lòng nhập mật khẩu')
        return
      } else {
        document.getElementById('password').setCustomValidity('')
      }

      $scope.goBackHome = function () {
        window.location.href = '/'
      }

      $scope.closeDialog = function () {
        document.getElementById('ErrorDialog').style.display = 'none'
      }

      let data = {
        email: $scope.email,
        password: $scope.password
      }
      console.log(data)
      apiService.signin(data)
        .then(function (response) {
          console.log(response)
          console.log(response.message)
          console.log(response.data.status)
          if (response.data.status == 200) {
            window.location.href = '/'
          } else if (response.data.status != 200) {
            console.log(response.data.errorMessage)
            $scope.error = response.data.errorMessage
            document.getElementById('ErrorDialog').style.display = 'block'
          }
        }).catch(function (err) {
          console.log(err)
          $scope.error = err.data.errorMessage
          document.getElementById('ErrorDialog').style.display = 'block'
        })
    }
  }])
})()
