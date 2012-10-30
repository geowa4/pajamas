/*global pj:true module:true asyncTest:true ok:true strictEqual:true start:true*/
module('JSONP test', {
    setup    : function () {
      this.now = Date.now
      Date.now = function () { return 0 }
    }
  , teardown : function () {
      Date.now = this.now
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

  asyncTest('remote JSONP', 1, function () {
    pj({
        url : 'http://gumball.wickedlysmart.com/'
      , dataType : 'jsonp'
    })
    .then(function (data) {
        strictEqual(Object.prototype.toString.call(data), '[object Array]', 'data is an array')
        start()
      }
    , function () {
        ok(false, 'deferred was rejected')
        start()
      })
  })
})
