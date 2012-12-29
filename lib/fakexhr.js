(function () {
  var i
    , fakeMethods = ['open', 'send', 'setRequestHeader']
  window.FakeXHR= function () {
    this.args = {}
    FakeXHR.instance = this
    FakeXHR.newHook && FakeXHR.newHook()
  }
  FakeXHR.prototype.methodCallCount = function (name) {
    return this.args[name] ? this.args[name].length : 0
  }
  FakeXHR.prototype.methodCallArgs = function (name, i, j) {
    var a = this.args[name] && this.args[name].length > i ? this.args[name][i] : null
    if (arguments.length > 2) return a && a.length > j ? a[j] : null
    return a
  }
  for (i = 0; i < fakeMethods.length; i++) {
    (function (f) {
      FakeXHR.prototype[f] = function () {
        if (!this.args[f]) this.args[f] = []
        this.args[f].push(Array.prototype.slice.call(arguments, 0))
        FakeXHR[f + 'Hook'] && FakeXHR[f + 'Hook']()
      }
    } (fakeMethods[i]))
  }
}).call(this)