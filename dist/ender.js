!(function ($) {
  var pj = require('pajamas')
    , integrate = function(method) {
        return function() {
          var args = []
            , i = (this && this.length) || 0
          while (i--) args.unshift(this[i])
          return pj[method].apply(null, args)
        }
      }
    , s = integrate('serialize')
    , sa = integrate('serializeArray')
    , v = integrate('val')

  $.ender({
      ajax  : pj
    , param : pj.param
  })

  $.ender({
      serialize      : s
    , serializeArray : sa
    , val            : v
  }, true)
} (ender))
