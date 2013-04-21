/*global pj:true FakeXHR:true module:true test:true asyncTest:true ok:true deepEqual:true strictEqual:true start:true*/
module('fake xhr', {
  setup : function () {
    FakeXHR.instance = null
  }
})

test('check method calls', 10, function () {
  pj({
    url      : 'xml-test.xml'
  , dataType : 'xml'
  , data     : {
      foo : 'bar'
    }
  , xhr      : function () {
      return new FakeXHR()
    }
  })

  strictEqual(FakeXHR.instance.methodCallCount('open'), 1, 'open called')
  strictEqual(FakeXHR.instance.methodCallArgs('open', 0).length, 3, 'open called with 3 args')
  deepEqual(FakeXHR.instance.methodCallArgs('open', 0), ['GET', 'xml-test.xml?foo=bar', true], 'check open args')

  strictEqual(FakeXHR.instance.methodCallCount('setRequestHeader'), 3, 'setRequestHeader called 3x')
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 0), ['Accept', 'application/xml, text/xml'], 'Accepts header is set')
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 1), ['X-Requested-With', 'XMLHttpRequest'], 'X-Requested-With header is set')
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 2), ['Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'], 'Content-Type header is set')

  strictEqual(FakeXHR.instance.methodCallCount('send'), 1, 'send called')
  strictEqual(FakeXHR.instance.methodCallArgs('send', 0).length, 1, 'send called with 1 args')
  deepEqual(FakeXHR.instance.methodCallArgs('send', 0), [null], 'send called with null')
})

test('infer xml data type', 1, function () {
  pj({
    url : 'xml-test.xml'
  , xhr : function () {
      return new FakeXHR()
    }
  })

  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 0), ['Accept', 'application/xml, text/xml'], 'Accepts header defaults to xml')
})


module('valid GET')

asyncTest('GET XML', 7, function () {
  pj({
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
    strictEqual(doc.firstChild.firstChild.nodeValue, 'baz', 'Inner value is \'baz\'')
    start()
  }, function () {
    ok(false, 'deferred was rejected')
    start()
  })
})


module('invalid GET')

asyncTest('GET bad XML', function () {
  pj({
    url      : 'xml-test-invalid.xml'
  , dataType : 'xml'
  }).then(function (value) {
    strictEqual(value, null, 'response is null')
    start()
  }, function () {
    ok(false, 'deferred was rejected')
    start()
  })
})

asyncTest('GET non-existent XML', 1, function () {
  pj({
    url      : 'this-file-does-not-exist.xml'
  , dataType : 'xml'
  }).then(function () {
    ok(false, 'deferred was resolved')
    start()
  }, function () {
    ok(true, 'deferred was rejected')
    start()
  })
})


module('verbose response')

asyncTest('resolution value is a object', 3, function () {
  pj({
    url               : 'xml-test.xml'
  , verboseResolution : true
  })
  .then(function (value) {
    strictEqual(Object.prototype.toString.call(value.xhr), '[object XMLHttpRequest]', 'XHR object provided with value')
    strictEqual(Object.prototype.toString.call(value.status), '[object Number]', 'response status is set')
    strictEqual(Object.prototype.toString.call(value.response), '[object Document]', 'response came back parsed')
    start()
  }, function () {
    ok(false, 'promise was rejected')
    start()
  })
})
