/*global pj:true module:true asyncTest:true test:true ok:true deepEqual:true start:true*/

module('success')

asyncTest('success handler can be null', 1, function () {
  pj({
      url     : '../json/json-test.json'
    , success : null
  })
  .then(function (value) {
      ok(value != null, 'value is returned')
    }
  , function () {
      ok(false, 'promise was rejected')
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
  .then(function (value) {
      ok(check, 'success handler already ran')
    }
  , function () {
      ok(false, 'promise was rejected')
    })
})

module('error')

asyncTest('error handler can be null', 1, function () {
  pj({
      url   : 'this-does-not-exist.json'
    , error : null
  })
  .then(function (value) {
      ok(false, 'promise was resolved')
    }
  , function (reason) {
      ok(reason != null, 'reason given')
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
  .then(function (value) {
      ok(false, 'promise was resolved')
    }
  , function () {
      ok(check, 'error handler already ran')
    })
})