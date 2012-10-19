(function () {
  var i
    , fakeMethods = ['open', 'send', 'setRequestHeader']
  window.FakeXHR= function () {
    this.args = {}
    FakeXHR.instance = this
  }
  FakeXHR.setup = function () {
    FakeXHR.oldxhr = window['XMLHttpRequest']
    FakeXHR.oldaxo = window['ActiveXObject']
    window['XMLHttpRequest'] = FakeXHR
    window['ActiveXObject'] = FakeXHR
    FakeXHR.instance = null
  }
  FakeXHR.restore = function () {
    window['XMLHttpRequest'] = FakeXHR.oldxhr
    window['ActiveXObject'] = FakeXHR.oldaxo
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
      }
    } (fakeMethods[i]))
  }
}).call(this)