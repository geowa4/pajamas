module('valid GET')

asyncTest('GET valid JSON', 4, function () {
  Qjax({
      url      : 'json-test.json'
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
  }, function (reason) {
    ok(false, 'deferred was rejected')
    start()
  })
})

asyncTest('GET valid JSON with data', 4, function () {
  Qjax({
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
  }, function (reason) {
    ok(false, 'deferred was rejected')
    start()
  })
})


module('invalid GET')

asyncTest('GET valid JSON', 1, function () {
  Qjax({
      url      : 'this-does-not-exist.json'
    , dataType : 'json'
  }).then(function (value) {
    ok(false, 'deferred was resolved')
    start()
  }, function (reason) {
    ok(true, 'deferred was rejected')
    start()
  })
})


module('valid POST')

asyncTest('POST valid JSON', 4, function () {
  Qjax({
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
  }, function (reason) {
    ok(false, 'deferred was rejected')
    start()
  })
})

asyncTest('POST valid JSON with data', 4, function () {
  Qjax({
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
  }, function (reason) {
    ok(false, 'deferred was rejected')
    start()
  })
})


module('invalid POST')

asyncTest('POST valid JSON', 1, function () {
  Qjax({
      url      : 'this-does-not-exist.json'
    , dataType : 'json'
  }).then(function (value) {
    ok(false, 'deferred was resolved')
    start()
  }, function (reason) {
    ok(true, 'deferred was rejected')
    start()
  })
})