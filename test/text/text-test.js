/*global pj:true FakeXHR:true module:true test:true asyncTest:true ok:true deepEqual:true strictEqual:true start:true*/
module('fake xhr', {
    setup : function () {
      FakeXHR.instance = null
    }
})

test('infer text data type', 1, function () {
  pj({
      url : 'text-test-value.txt'
    , xhr : function () {
        return new FakeXHR()
      }
  })

  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 0), [
        'Accept'
      , 'text/plain'
    ]
    , 'Accepts header defaults to text')
})

test('check method calls', 10, function () {
  pj({
      url      : 'text-test-value.htm'
    , dataType : 'text'
    , data     : {
        foo : 'bar'
      }
    , xhr      : function () {
        return new FakeXHR()
      }
  })

  strictEqual(FakeXHR.instance.methodCallCount('open'), 1, 'open called')
  strictEqual(FakeXHR.instance.methodCallArgs('open', 0).length, 3, 'open called with 3 args')
  deepEqual(FakeXHR.instance.methodCallArgs('open', 0), ['GET', 'text-test-value.htm?foo=bar', true], 'check open args')

  strictEqual(FakeXHR.instance.methodCallCount('setRequestHeader'), 3, 'setRequestHeader called 3x')
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 0), ['Accept', 'text/plain'], 'Accepts header is set')
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 1), ['X-Requested-With', 'XMLHttpRequest'], 'X-Requested-With header is set')
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 2), ['Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'], 'Content-Type header is set')

  strictEqual(FakeXHR.instance.methodCallCount('send'), 1, 'send called')
  strictEqual(FakeXHR.instance.methodCallArgs('send', 0).length, 1, 'send called with 1 args')
  deepEqual(FakeXHR.instance.methodCallArgs('send', 0), [null], 'send called with null')
})


module('valid GET')

asyncTest('GET text', 4, function () {
  pj({
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
  pj({
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
  pj({
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
  pj({
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
