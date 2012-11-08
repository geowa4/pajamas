/*global requirejs:true module:true asyncTest:true ok:true start:true*/
requirejs.config({
    baseUrl : '../..'
  , paths : {
        q    : 'lib/q'
      , pj : 'src/pajamas'
    }
})


module('AMD load')

asyncTest('pajamas loads via AMD', 2, function () {
  requirejs(['pj'], function (pj) {
    ok(typeof window.pj === 'undefined', 'pajamas is not global')
    ok(typeof pj === 'function', 'pajamas is defined and is a function')
    start()
  }, function (err) {
    ok(false, err.requireType)
    start()
  })
})
