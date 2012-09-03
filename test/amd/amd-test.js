/*global requirejs:true module:true asyncTest:true ok:true start:true stop:true*/
requirejs.config({
    baseUrl : '../..'
  , paths : {
        q    : 'lib/q'
      , qjax : 'src/qjax'
    }
})


module('AMD load')

asyncTest('qjax loads via AMD', 2, function () {
  requirejs(['qjax'], function (qjax) {
    ok(typeof window.qjax === 'undefined', 'qjax is not global')
    ok(typeof qjax === 'function', 'qjax is defined and is a function')
    start()
  }, function (err) {
    ok(false, err.requireType)
    start()
  })
})
