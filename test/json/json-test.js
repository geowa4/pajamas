/*global pj:true FakeXHR:true module:true test:true asyncTest:true ok:true strictEqual:true deepEqual:true start:true*/
module('fake xhr', {
    setup : function () {
      FakeXHR.instance = null
    }
})

test('check method calls', 10, function () {
  pj({
      url      : 'json-test.json'
    , dataType : 'json'
    , data     : {
        foo : 'bar'
      }
    , xhr      : function () {
        return new FakeXHR()
      }
  })

  strictEqual(FakeXHR.instance.methodCallCount('open'), 1, 'open called')
  strictEqual(FakeXHR.instance.methodCallArgs('open', 0).length, 3, 'open called with 3 args')
  deepEqual(FakeXHR.instance.methodCallArgs('open', 0), ['GET', 'json-test.json?foo=bar', true], 'check open args')

  strictEqual(FakeXHR.instance.methodCallCount('setRequestHeader'), 3, 'setRequestHeader called 3x')
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 0), ['Accept', 'application/json, text/javascript'], 'Accepts header is set')
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 1), ['X-Requested-With', 'XMLHttpRequest'], 'X-Requested-With header is set')
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 2), ['Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'], 'Content-Type header is set')

  strictEqual(FakeXHR.instance.methodCallCount('send'), 1, 'send called')
  strictEqual(FakeXHR.instance.methodCallArgs('send', 0).length, 1, 'send called with 1 args')
  deepEqual(FakeXHR.instance.methodCallArgs('send', 0), [null], 'send called with null')
})

test('infer JSON data type', 1, function () {
  pj({
      url : 'json-test.json'
    , xhr : function () {
        return new FakeXHR()
      }
  })

  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 0), ['Accept', 'application/json, text/javascript'], 'Accepts header defaults to JSON')
})

test('data not processed', 1, function () {
  pj({
      url         : 'json-test.json'
    , processData : false
    , data        : {foo : 'bar'}
    , xhr         : function () {
        return new FakeXHR()
      }
  })

  deepEqual(FakeXHR.instance.methodCallArgs('send', 0), [{foo : 'bar'}], 'send called with original data')
})


module('valid GET')

asyncTest('GET valid JSON', 4, function () {
  pj({
      url      : 'json-test.json'
    , dataType : 'json'
  }).then(function (value) {
    ok(true, 'deferred was resolved')
    ok(value != null, 'response received')
    strictEqual(Object.prototype.toString.call(value)
      , '[object Object]'
      , 'response is an object')
    deepEqual(value
      , {
          'success': true
        }
      , 'response parsed properly')
    start()
  }, function () {
    ok(false, 'deferred was rejected')
    start()
  })
})

asyncTest('GET valid JSON with data', 4, function () {
  pj({
      url      : 'json-test.json'
    , dataType : 'json'
    , data     : {
        'throwaway' : true
      }
  }).then(function (value) {
    ok(true, 'deferred was resolved')
    ok(value != null, 'response received')
    strictEqual(Object.prototype.toString.call(value)
      , '[object Object]'
      , 'response is an object')
    deepEqual(value
      , {
          'success': true
        }
      , 'response parsed properly')
    start()
  }, function () {
    ok(false, 'deferred was rejected')
    start()
  })
})

asyncTest('parse valid JSON without using window.JSON', 4, function () {
  var _JSON = window.JSON
  if (window.JSON) delete window.JSON
  pj({
      url      : 'json-test.json'
    , dataType : 'json'
    , data     : {
        'throwaway' : true
      }
  }).then(function (value) {
    ok(true, 'deferred was resolved')
    ok(value != null, 'response received')
    strictEqual(Object.prototype.toString.call(value)
      , '[object Object]'
      , 'response is an object')
    deepEqual(value
      , {
          'success': true
        }
      , 'response parsed properly')
    start()
    window.JSON = _JSON
  }, function () {
    ok(false, 'deferred was rejected')
    start()
    window.JSON = _JSON
  })
})


module('invalid GET')

asyncTest('GET with defaults (url does not exist)', 1, function () {
  pj({
      url      : 'this-does-not-exist.json'
    , dataType : 'json'
  }).then(function () {
    ok(false, 'deferred was resolved')
    start()
  }, function () {
    ok(true, 'deferred was rejected')
    start()
  })
})

asyncTest('GET JSON that does not exist', 1, function () {
  pj({
      url      : 'this-does-not-exist.json'
    , dataType : 'json'
  }).then(function () {
    ok(false, 'deferred was resolved')
    start()
  }, function () {
    ok(true, 'deferred was rejected')
    start()
  })
})


module('valid POST')

asyncTest('POST valid JSON', 4, function () {
  pj({
      url      : 'json-test.json'
    , dataType : 'json'
    , method   : 'POST'
  }).then(function (value) {
    ok(true, 'deferred was resolved')
    ok(value != null, 'response received')
    strictEqual(Object.prototype.toString.call(value)
      , '[object Object]'
      , 'response is an object')
    deepEqual(value
      , {
          'success': true
        }
      , 'response parsed properly')
    start()
  }, function () {
    ok(false, 'deferred was rejected')
    start()
  })
})

asyncTest('POST valid JSON with data', 4, function () {
  pj({
      url      : 'json-test.json'
    , dataType : 'json'
    , method   : 'POST'
    , data     : {
        'throwaway' : true
      }
  }).then(function (value) {
    ok(true, 'deferred was resolved')
    ok(value != null, 'response received')
    strictEqual(Object.prototype.toString.call(value)
      , '[object Object]'
      , 'response is an object')
    deepEqual(value
      , {
          'success': true
        }
      , 'response parsed properly')
    start()
  }, function () {
    ok(false, 'deferred was rejected')
    start()
  })
})


module('invalid POST')

asyncTest('POST JSON to somewhere that does not exist', 1, function () {
  pj({
      url      : 'this-does-not-exist.json'
    , dataType : 'json'
  }).then(function () {
    ok(false, 'deferred was resolved')
    start()
  }, function () {
    ok(true, 'deferred was rejected')
    start()
  })
})


module('delay and timeout')

asyncTest('test timeout', function () {
  pj({
      url     : 'json-test.json'
    , delay   : 100
    , timeout : 1
  }).then(function () {
    ok(false, 'timeout should have rejected this')
    start()
  }, function (error) {
    strictEqual(error.message, 'timeout', 'rejected with \'timeout\' as the message')
    start()
  })
})


