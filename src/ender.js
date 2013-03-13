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
    ajax      : pj
  , post      : pj.partial({type : 'POST'})
  , get       : pj.partial({type : 'GET'})
  , getJSON   : pj.partial({type : 'GET', dataType : 'json'})
  , getScript : pj.partial({type : 'GET', dataType : 'script'})
  , param     : pj.param
  })

  $.ender({
    serialize      : s
  , serializeArray : sa
  , val            : v
  }, true)
} (ender))
