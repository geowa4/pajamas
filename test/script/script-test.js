/*global qjax:true FakeXHR:true module:true test:true asyncTest:true ok:true strictEqual:true deepEqual:true start:true*/
module('fake xhr', {
    setup    : function () {
      FakeXHR.instance = null
    }
})

test('infer script data type', 1, function () {
  qjax({
      url : 'script-test.js'
    , xhr : function () {
        return new FakeXHR()
      }
  })

  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 0), [
        'Accept'
      , 'text/javascript, application/javascript,' +
        ' application/ecmascript, application/x-ecmascript'
    ]
    , 'Accepts header defaults to script')
})

test('check method calls', 10, function () {
  qjax({
      url      : 'script-test.js'
    , dataType : 'script'
    , data     : {
        foo : 'bar'
      }
    , xhr      : function () {
        return new FakeXHR()
      }
  })

  strictEqual(FakeXHR.instance.methodCallCount('open'), 1, 'open called')
  strictEqual(FakeXHR.instance.methodCallArgs('open', 0).length, 3, 'open called with 3 args')
  deepEqual(FakeXHR.instance.methodCallArgs('open', 0), ['GET', 'script-test.js?foo=bar', true], 'check open args')

  strictEqual(FakeXHR.instance.methodCallCount('setRequestHeader'), 3, 'setRequestHeader called 3x')
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 0), ['Accept', 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'], 'Accepts header is set')
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 1), ['X-Requested-With', 'XMLHttpRequest'], 'X-Requested-With header is set')
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 2), ['Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'], 'Content-Type header is set')

  strictEqual(FakeXHR.instance.methodCallCount('send'), 1, 'send called')
  strictEqual(FakeXHR.instance.methodCallArgs('send', 0).length, 1, 'send called with 1 args')
  deepEqual(FakeXHR.instance.methodCallArgs('send', 0), [null], 'send called with null')
})


module('valid GET')

asyncTest('GET value', 3, function () {
  qjax({
      url      : 'script-test-value.js'
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
      url      : 'script-test-error.js'
    , dataType : 'script'
  }).then(function (value) {
    ok(false, 'deferred was resolved')
    start()
  }, function (reason) {
    strictEqual(reason.message, 'invalid', 'deferred was rejected')
    start()
  })
})
