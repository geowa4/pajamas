/*global pj:true FakeXHR:true module:true asyncTest:true test:true ok:true deepEqual:true start:true*/
module('fake xhr', {
    setup : function () {
      FakeXHR.instance = null
    }
})

test('Accept header when dataType is set to *', 1, function () {
  pj({
      url      : 'asterisk-test.html'
    , dataType : '*'
    , xhr      : function () {
        return new FakeXHR()
      }
  })

  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 0), ['Accept', 'text/javascript, text/html, application/xml, text/xml, */*'], 'Accepts header is set')
})


module('deferred resolution')

asyncTest('resolved with the xhr', 1, function () {
  pj({
      url      : 'asterisk-test.html'
    , dataType : '*'
  }).then(function (response) {
    ok(response instanceof (window.XMLHttpRequest || window.ActiveXObject), 'resolved with the xhr')
    start()
  }, function () {
    ok(false, 'deferred was rejected')
    start()
  })
})
