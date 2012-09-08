/*global qjax:true module:true asyncTest:true ok:true strictEqual:true start:true*/
module('valid GET')

asyncTest('GET value', 3, function () {
  qjax({
      url      : 'js-test-value.js'
    , dataType : 'script'
  }).then(function (value) {
    ok(true, 'deferred was resolved')
    ok(value != null, 'response received')
    strictEqual(value
      , 7
      , 'response is a number')
    start()
  }, function (reason) {
    ok(false, 'deferred was rejected')
    start()
  })
})


module('invalid GET')

asyncTest('GET JS that does not exist', 1, function () {
  qjax({
      url      : 'this-does-not-exist.js'
    , dataType : 'script'
  }).then(function (value) {
    ok(false, 'deferred was resolved')
    start()
  }, function (reason) {
    ok(true, 'deferred was rejected')
    start()
  })
})

asyncTest('GET error-ridden JS', 1, function () {
  qjax({
      url      : 'js-test-error.js'
    , dataType : 'script'
  }).then(function (value) {
    ok(false, 'deferred was resolved')
    start()
  }, function (reason) {
    strictEqual(reason.message, 'invalid', 'deferred was rejected')
    start()
  })
})
