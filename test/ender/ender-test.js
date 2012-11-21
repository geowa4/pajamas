/*global ender:true $:true module:true test:true strictEqual:true deepEqual ok:true*/

// Q doesn't explicitly support Ender so these are sanity checks
module('Q + Ender')

test('Q is available', function () {
  var Q = require('Q')
  strictEqual(ender.when, Q.when, 'Q is applied to ender')
  ok(Q.isPromise(Q.when(true)), 'Q still works')
})


module('serialization')

test('serialization methods added to ender', 5, function () {
  var pj = require('pajamas')
  strictEqual(typeof ender.fn.serialize, 'function', 'serialize on ender.fn')
  strictEqual(typeof ender.fn.serializeArray, 'function', 'serializeArray on ender.fn')
  strictEqual(typeof ender.fn.val, 'function', 'val on ender.fn')
  strictEqual(typeof ender.fn.param, 'undefined', 'param not in prototype')
  strictEqual(ender.param, pj.param, 'param is the same')
})

test('serialization works the same', 3, function () {
  var pj = require('pj')
    , form = document.getElementById('form')
    , name = document.getElementById('name')
  strictEqual($(form).serialize(), pj.serialize(form), 'serialize form')
  deepEqual($(form).serializeArray(), pj.serializeArray(form), 'serialize form as array')
  strictEqual($(name).val(), pj.val(name), 'get val of form element')
})