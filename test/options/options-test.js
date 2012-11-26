/*global pj:true module:true asyncTest:true ok:true start:true*/

module('success')

asyncTest('success handler can be null', 1, function () {
  pj({
      url     : '../json/json-test.json'
    , success : null
  })
  .then(function (value) {
      ok(value != null, 'value is returned')
      start()
    }
  , function () {
      ok(false, 'promise was rejected')
      start()
    })
})

asyncTest('success handler fires first', 1, function () {
  var check = false
  pj({
      url     : '../json/json-test.json'
    , success : function () {
        check = true
      }
  })
  .then(function () {
      ok(check, 'success handler already ran')
      start()
    }
  , function () {
      ok(false, 'promise was rejected')
      start()
    })
})

module('error')

asyncTest('error handler can be null', 1, function () {
  pj({
      url   : 'this-does-not-exist.json'
    , error : null
  })
  .then(function () {
      ok(false, 'promise was resolved')
      start()
    }
  , function (reason) {
      ok(reason != null, 'reason given')
      start()
    })
})

asyncTest('error handler fires first', function () {
  var check = false
  pj({
      url     : 'this-does-not-exist.json'
    , error : function () {
        check = true
      }
  })
  .then(function () {
      ok(false, 'promise was resolved')
      start()
    }
  , function () {
      ok(check, 'error handler already ran')
      start()
    })
})