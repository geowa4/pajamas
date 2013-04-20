/*global pj:true module:true asyncTest:true ok:true strictEqual:true start:true*/

module('success')

asyncTest('success handler can be null', 1, function () {
  pj({
    url     : '../json/json-test.json'
  , success : null
  })
  .then(function (value) {
    ok(value != null, 'value is returned')
    start()
  }, function () {
    ok(false, 'promise was rejected')
    start()
  })
})

asyncTest('success handler fires first', 3, function () {
  var check = false
    , originalValue

  pj({
    url     : '../json/json-test.json'
  , success : function (value) {
      check = true
      originalValue = value
    }
  })
  .then(function (value) {
    ok(check, 'success handler already ran')
    strictEqual(value, originalValue, 'original value is maintained')
    start()
  }, function () {
    ok(false, 'promise was rejected')
    start()
  })

  pj({
    url     : '../json/json-test.json'
  , success : function () {
      throw new Error('failed')
    }
  })
  .then(function () {
    ok(false, 'promise was resolved')
    start()
  }, function (reason) {
    strictEqual(reason.message, 'failed', 'promise became rejected')
    start()
  })
})


module('error')

asyncTest('error handler can be null', 2, function () {
  pj({
    url   : 'this-does-not-exist.json'
  , error : null
  })
  .then(function () {
    ok(false, 'promise was resolved')
    start()
  }, function (reason) {
    ok(reason != null, 'reason given')
    strictEqual(Object.prototype.toString.call(reason.xhr), '[object XMLHttpRequest]', 'XHR provided with reason')
    start()
  })
})

asyncTest('error handler fires first', 3, function () {
  var check = false
    , originalReason
  pj({
    url   : 'this-does-not-exist.json'
  , error : function (reason) {
      check = true
      originalReason = reason
    }
  })
  .then(function () {
    ok(false, 'promise was resolved')
    start()
  }, function (reason) {
    ok(check, 'error handler already ran')
    strictEqual(reason, originalReason, 'original reason is maintained')
    start()
  })

  pj({
    url   : 'this-does-not-exist.json'
  , error : function () {
      return true
    }
  })
  .then(function (value) {
    strictEqual(value, true, 'promise became resolved')
    start()
  }, function () {
    ok(false, 'promise was rejected')
    start()
  })
})