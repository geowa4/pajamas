/*global qjax:true module:true asyncTest:true ok:true strictEqual:true deepEqual:true start:true*/
module('valid GET')

asyncTest('GET valid JSON', 4, function () {
  qjax({
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
  qjax({
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

asyncTest('parse valid JSON without using window.JSON', 4, function () {
  var _JSON = window.JSON
  if (window.JSON) delete window.JSON
  qjax({
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
  }, function (reason) {
    ok(false, 'deferred was rejected')
    start()
    window.JSON = _JSON
  })
})


module('invalid GET')

asyncTest('GET with defaults (url does not exist)', 1, function () {
  qjax({
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

asyncTest('GET JSON that does not exist', 1, function () {
  qjax({
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
  qjax({
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
  qjax({
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

asyncTest('POST JSON to somewhere that does not exist', 1, function () {
  qjax({
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
