/*global pj:true module:true asyncTest:true ok:true strictEqual:true start:true*/
module('remote script test', {
    setup    : function () {
      this.now = Date.now
      Date.now = function () { return 0 }
    }
  , teardown : function () {
      Date.now = this.now
    }
})

asyncTest('JS file loaded', 3, function () {
  pj({
      url : 'http://underscorejs.org/underscore.js'
  })
  .then(function () {
      strictEqual(arguments.length, 1, 'no arguments')
      strictEqual(typeof arguments[0], 'undefined', 'no arguments')
      ok(typeof window._ !== 'undefined', 'underscore was loaded')
      start()
    }
  , function () {
      ok(false, 'deferred was rejected')
      start()
    })
})
