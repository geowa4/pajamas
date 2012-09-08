/*global qjax:true module:true asyncTest:true ok:true strictEqual:true start:true*/
module('valid GET')

asyncTest('GET text', 4, function () {
  qjax({
      url      : 'text-test-value.htm'
    , dataType : 'text'
  }).then(function (value) {
    ok(true, 'deferred was resolved')
    ok(value != null, 'response received')
    strictEqual(typeof value, 'string', 'value is a String')
    strictEqual(value
      , '<h1>hello, world</h1>'
      , 'response is an html fragment')
    start()
  }, function (reason) {
    ok(false, 'deferred was rejected')
    start()
  })
})

asyncTest('GET HTML', 3, function () {
  qjax({
      url      : 'text-test-value.htm'
    , dataType : 'html'
  }).then(function (value) {
    ok(true, 'deferred was resolved')
    ok(value != null, 'response received')
    strictEqual(value
      , '<h1>hello, world</h1>'
      , 'response is an html fragment')
    start()
  }, function (reason) {
    ok(false, 'deferred was rejected')
    start()
  })
})


module('invalid GET')

asyncTest('GET text that does not exist', 1, function () {
  qjax({
      url      : 'this-does-not-exist.txt'
    , dataType : 'text'
  }).then(function (value) {
    ok(false, 'deferred was resolved')
    start()
  }, function (reason) {
    ok(true, 'deferred was rejected')
    start()
  })
})

asyncTest('GET HTML that does not exist', 1, function () {
  qjax({
      url      : 'this-does-not-exist.htm'
    , dataType : 'html'
  }).then(function (value) {
    ok(false, 'deferred was resolved')
    start()
  }, function (reason) {
    ok(true, 'deferred was rejected')
    start()
  })
})
