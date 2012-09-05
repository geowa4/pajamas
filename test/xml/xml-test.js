/*global qjax:true module:true asyncTest:true ok:true strictEqual:true start:true Document:true*/
module('valid GET')

asyncTest('GET XML', 7, function () {
  qjax({
      url      : 'xml-test.xml'
    , dataType : 'xml'
  }).then(function (value) {
    var doc
    ok(true, 'deferred was resolved')
    ok(value != null, 'response received')
    doc = value.documentElement
    ok(!!doc, 'Document Element is defined')
    strictEqual(doc.nodeName, 'foo', 'xml root is <foo>')
    ok(doc.hasChildNodes, 'document has child nodes')
    strictEqual(doc.firstChild.nodeName, 'bar', 'first child is <bar>')
    strictEqual(doc.firstChild.firstChild.nodeValue, 'baz',
      'Inner value is \'baz\'')
    start()
  }, function (reason) {
    ok(false, 'deferred was rejected')
    start()
  })
})


module('invalid GET')

asyncTest('GET bad XML', function () {
  qjax({
      url      : 'xml-test-invalid.xml'
    , dataType : 'xml'
  }).then(function (value) {
    strictEqual(value, null, 'response is null')
    start()
  }, function (reason) {
    ok(false, 'deferred was rejected')
    start()
  })
})

asyncTest('GET non-existent XML', 1, function () {
  qjax({
      url      : 'this-file-does-not-exist.xml'
    , dataType : 'xml'
  }).then(function (value) {
    ok(false, 'deferred was resolved')
    start()
  }, function (reason) {
    ok(true, 'deferred was rejected')
    start()
  })
})
