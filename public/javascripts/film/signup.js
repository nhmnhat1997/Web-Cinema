(() => {
  const app = angular.module('Cinema-Web')
  app.controller('signupController', ['$scope', 'apiService', function ($scope, apiService) {
    $scope.userName = ''
    $scope.email = ''
    $scope.password = ''
    $scope.clickSignUp = function () {
      if (!$scope.userName) {
        document.getElementById('userName').setCustomValidity('Vui lòng nhập tên của bạn')
        return
      }
      else {
        document.getElementById('userName').setCustomValidity('')
      }
      if (!$scope.email) {
        document.getElementById('email').setCustomValidity('Vui lòng nhập email của bạn')
        return
      }
      else {
        document.getElementById('email').setCustomValidity('')
      }
      if (!COMMON.isEmailValid($scope.email)) {
        document.getElementById('email').setCustomValidity('Email không đúng định dạng')
        return
      }
      else {
        document.getElementById('email').setCustomValidity('')
      }
      if (!$scope.password) {
        document.getElementById('password').setCustomValidity('Vui lòng nhập mật khẩu')
        return
      }
      else {
        document.getElementById('password').setCustomValidity('')
      }
      if (!$scope.reEnterPassword) {
        document.getElementById('reEnterPassword').setCustomValidity('Vui lòng nhập mật khẩu lần 2')
        return
      }
      else {
        document.getElementById('reEnterPassword').setCustomValidity('')
      }
      if (!($scope.password === $scope.reEnterPassword)) {
        document.getElementById('reEnterPassword').setCustomValidity('2 mật khẩu không trùng khớp, vui lòng kiểm tra lại.')
        return
      }
      else {
        document.getElementById('reEnterPassword').setCustomValidity('')
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
