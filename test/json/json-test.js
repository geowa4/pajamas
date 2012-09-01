module('GET')

asyncTest('GET valid JSON', 4, function () {
  Qjax({
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
