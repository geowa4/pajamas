!(function (factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory(require('q'))
  else if (typeof define === 'function' && define.amd) define(['q'], factory)
  else this['qjax'] = factory(this['Q'])
} (function (Q) {
  var win = window
    , readyState = 'readyState'
    , xmlHttpRequest = 'XMLHttpRequest'
    , xhr = win[xmlHttpRequest] ?
        function () { return new win[xmlHttpRequest]() } :
        function () { return new ActiveXObject('Microsoft.XMLHTTP') }
    , responseText = 'responseText'
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , defaultHeaders = {
          contentType: 'application/x-www-form-urlencoded'
        , Accept: {
              '*'  : 'text/javascript, text/html, application/xml,' +
                     ' text/xml, */*'
            , xml  : 'application/xml, text/xml'
            , html : 'text/html'
            , text : 'text/plain'
            , json : 'application/json, text/javascript'
            , js   : 'application/javascript, text/javascript'
          }
        , requestedWith: xmlHttpRequest
      }
    , toString = Object.prototype.toString
    , isArray = Array.isArray || function (obj) {
        return obj instanceof Array
      }
      // TODO: evaluate use of `result`
    , result = function (obj, prop) {
        var val
        if (obj == null) return null
        val = obj[prop]
        return (typeof val === 'function') ? val.call(obj) : val
      }
    , urlAppend = function (url, dataString) {
        return url + (url.indexOf('?') !== -1 ? '&' : '?') + dataString
      }
    , setHeaders = function (http, options) {
        var headers = options.headers || {}
          , accept = 'Accept'
          , h

        headers[accept] = headers[accept] ||
          defaultHeaders[accept][options.dataType] ||
          defaultHeaders[accept]['*']

        if (!options.crossOrigin && !headers[requestedWith])
          headers[requestedWith] = defaultHeaders.requestedWith
        if (!headers[contentType])
          headers[contentType] = options.contentType ||
            defaultHeaders.contentType
        for (h in headers)
          if (headers.hasOwnProperty(h)) http.setRequestHeader(h, headers[h])
      }
    , toQueryString = function (data) {
        var queryString = ''
          , enc = encodeURIComponent
          , push = function (k, v) {
              queryString += enc(k) + '=' + enc(v) + '&'
            }
          , i
          , val
          , prop

        if (isArray(data)) {
          for (i = 0; data && i < data.length; i++)
            push(data[i].name, data[i].value)
        } else {
          for (prop in data) {
            if (data.hasOwnProperty(prop)) {
              val = data[prop]
              if (isArray(val))
                for (i = 0; i < val.length; i++) push(prop, val[i])
              else push(prop, data[prop])
            }
          }
        }

        return queryString.replace(/&$/, '').replace(/%20/g,'+')
      }
    , responseParsers = {
        json : function (deferred) {
          var r = this[responseText]
          try {
            r = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
            deferred.resolve(r)
          } catch (err) {
            deferred.reject(new Error('Could not parse JSON in response.'))
          }
        }
      , text : function (deferred) {
          deferred.resolve(this[responseText])
        }
    }

  return function (options) {
    var deferred = Q.defer()
      , promise = deferred.promise
      // TODO: handle timeouts
      , timeout
      , o = options == null ? {} : options
      , method = (o.method || 'GET').toUpperCase()
      , url = o.url || ''
      , data = (o.processData !== false && o.data) ?
          toQueryString(o.data) :
          (o.data || null)
      , dataType = o.dataType || 'json'
      , http = xhr();
    if (data && method === 'GET') {
      url = urlAppend(url, data)
      data = null
    }
    http.open(method, url, true)
    setHeaders(http, o)
    http.onreadystatechange = function () {
      var status
      if (http && http[readyState] === 4) {
        status = http.status
        if (status >= 200 && status < 300 ||
            status === 304 ||
            status === 0 && http[responseText] !== '') {
          if (http[responseText])
            responseParsers[dataType].call(http, deferred)
          else
            deferred.resolve(null)
        } else deferred.reject(
                new Error(method + ' ' + url + ': ' +
                  http.status + ' ' + http.statusText))
      }
    }
    try {
      http.send(data)
    } catch (err) {
      deferred.reject(err)
    }
    return promise;
  }
}))
