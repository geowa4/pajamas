/*global pj:true module:true asyncTest:true ok:true strictEqual:true start:true*/
module('JSONP test', {
    setup    : function () {
      this.now = Date.now
      Date.now = function () { return 0 }
      this.random = Math.random
      Math.random = function() { return 0 }
    }
  , teardown : function () {
      Date.now = this.now
      Math.random = this.random
    }
})

asyncTest('JS file loaded', 2, function () {
  pj({
      url      : 'jsonp-data.js'
    , dataType : 'jsonp'
    , jsonp    : 'foo'
  })
  .then(function (data) {
      strictEqual(Object.prototype.toString.call(data), '[object Object]', 'data is an object')
      ok(data.works, 'data not corrupted')
      start()
    }
  , function () {
      ok(false, 'deferred was rejected')
      start()
    })
})

asyncTest('infer JSONP data type', 2, function () {
  pj({
      url : 'jsonp-inferred.jsonp'
  })
  .then(function (data) {
      strictEqual(Object.prototype.toString.call(data), '[object Object]', 'data is an object')
      ok(data.inferred, 'data not corrupted')
      start()
    }
  , function () {
      ok(false, 'deferred was rejected')
      start()
    })
})

asyncTest('remote JSONP', 1, function () {
  pj({
      url : 'https://api.github.com/repos/geowa4/pajamas'
    , dataType : 'jsonp'
  })
  .then(function (response) {
      strictEqual(response.data.name, 'pajamas', 'data is an array')
      start()
    }
  , function () {
      ok(false, 'deferred was rejected')
      start()
    })
})

asyncTest('JSONP endpoint does not exist, but is handled well by the server', 1, function () {
  pj({
      url : 'https://api.github.com/this-url-does-not-exist'
    , dataType : 'jsonp'
  })
  .then(function () {
      ok(true, 'deferred was resolved')
      start()
    }
  , function () {
      ok(false, 'deferred was rejected')
      start()
    })
})

asyncTest('JSONP endpoint does not exist and cannot be handled by the server', 1, function () {
  var url = 'http://example.com/this-url-does-not-exist'
  pj({
      url : 'http://example.com/this-url-does-not-exist'
    , dataType : 'jsonp'
  })
  .then(function () {
      ok(false, 'deferred was resolved')
      start()
    }
  , function (reason) {
      strictEqual(reason.message, 'Error loading ' + url + '?callback=pajamas00', 'deferred was rejected')
      start()
    })
})