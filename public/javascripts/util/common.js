function timeStampToString (timestamp) {
  var date = new Date(timestamp)
  var str = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
  return str
}

const COMMON = {
  timeStampToString: timeStampToString
}
