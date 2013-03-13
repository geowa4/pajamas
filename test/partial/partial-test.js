/*global pj:true FakeXHR:true module:true test:true deepEqual:true*/

module('partial', {
  setup : function () {
    FakeXHR.instance = null
  }
})

test('apply new options', 1, function () {
  var defaultParams, applied

  defaultParams = {
    xhr : function () { return new FakeXHR() }
  }
  applied = pj.partial(defaultParams)
  applied({
    url : 'test.xml'
  })
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 0), ['Accept', 'application/xml, text/xml'], 'Accept header is for XML')
})

test('deny overrides', 1, function () {
  var defaultParams, applied

  defaultParams = {
    xhr : function () { return new FakeXHR() }
  , url : 'test.xml'
  }
  applied = pj.partial(defaultParams)
  applied({
    url : 'test.json'
  })
  deepEqual(FakeXHR.instance.methodCallArgs('setRequestHeader', 0), ['Accept', 'application/xml, text/xml'], 'Accept header is still for XML')
})
