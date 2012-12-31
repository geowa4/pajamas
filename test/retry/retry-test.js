/*global pj:true FakeXHR:true module:true asyncTest:true strictEqual:true ok:true start:true*/
module('retry', {
  setup    : function () {
    FakeXHR.instance = null
    FakeXHR.sendHook = function () {
      // force every request to fail
      throw new Error()
    }
  }
, teardown : function () {
    FakeXHR.newHook = null
    FakeXHR.sendHook = null
  }
})

asyncTest('retry count of 0', 1, function () {
  var count = 0
  FakeXHR.newHook = function () {
    count++
  }

  pj({
    url   : 'does-not-exist'
  , retry : 0
  , xhr : function () {
      return new FakeXHR()
    }
  })
  .then(function () {
    ok(false, 'deferred was resolved')
    start()
  }, function () {
    strictEqual(count, 1, 'not retried')
    start()
  })
})

asyncTest('retry count greater than 0', 1, function () {
  var count = 0
  FakeXHR.newHook = function () {
    count++
  }

  pj({
    url   : 'does-not-exist'
  , retry : 3
  , xhr : function () {
      return new FakeXHR()
    }
  })
  .then(function () {
    ok(false, 'deferred was resolved')
    start()
  }, function () {
    strictEqual(count, 4, 'retried three times')
    start()
  })
})

asyncTest('retry object', 1, function () {
  pj({
    url   : 'does-not-exist'
  , retry : {
      url : 'retry-test.html'
    }
  , xhr   : function () {
      return new FakeXHR()
    }
  })
  .then(function (response) {
    strictEqual(typeof response, 'string', 'retry was successful')
    start()
  }, function () {
    ok(false, 'deferred was rejected')
    start()
  })
})

