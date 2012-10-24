!(function (factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory(require('q'))
  else if (typeof define === 'function' && define.amd) define(['q'], factory)
  else this['qjax'] = factory(this['Q'])
} (function (Q) {
  var win = window
    , doc = document
    , readyState = 'readyState'
    , xmlHttpRequest = 'XMLHttpRequest'
    , xhr = win[xmlHttpRequest] ?
        function () { return new win[xmlHttpRequest]() } :
        function () { return new win.ActiveXObject('Microsoft.XMLHTTP') }
    , responseText = 'responseText'
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , defaultHeaders = {
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        , Accept: {
              '*'    : 'text/javascript, text/html, application/xml,' +
                       ' text/xml, */*'
            , xml    : 'application/xml, text/xml'
            , html   : 'text/html'
            , text   : 'text/plain'
            , json   : 'application/json, text/javascript'
            , script : 'text/javascript, application/javascript,' +
                       ' application/ecmascript, application/x-ecmascript'
          }
        , requestedWith: xmlHttpRequest
      }
    , isArray = Array.isArray || function (obj) {
        return obj instanceof Array
      }
    , isFunction = typeof (/-/) !== 'function' ? function (obj) {
        return typeof obj === 'function'
      } : function (obj) {
        return Object.prototype.toString.call(obj) === '[object Function]'
      }
    , inferDataType = function (url) {
        var extension = url.substr(url.lastIndexOf('.') + 1)
        if (extension === url) return 'json'
        else if (extension === 'js') return 'script'
        else if (extension === 'txt') return 'text'
        else return extension
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

        if (!options.crossDomain && !headers[requestedWith])
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
    , defaultParser = function (deferred) {
        deferred.resolve(this)
      }
    , responseParsers = {
        json   : function (deferred) {
          var r = this[responseText]
          try {
            r = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
            deferred.resolve(r)
          } catch (err) {
            deferred.reject(new Error('Could not parse JSON in response.'))
          }
        }
      , script : function (deferred) {
          try {
            deferred.resolve(eval(this[responseText]))
          } catch (err) {
            deferred.reject(err)
          }
        }
      , text   : function (deferred) {
          deferred.resolve(String(this[responseText]))
        }
      , html   : function (deferred) {
          deferred.resolve(this[responseText])
        }
      , xml    : function (deferred) {
          var r = this.responseXML
          // Chrome makes `responseXML` null;
          // IE makes `documentElement` null;
          // FF makes up an element;
          // this is my attempt at standardization
          if (r === null || r.documentElement === null ||
              r.documentElement.nodeName === 'parsererror')
            deferred.resolve(null)
          else deferred.resolve(this.responseXML)
        }
      }
    , clone = function (o) {
        var copy = {}
          , prop
        for (prop in o) {
          if (o.hasOwnProperty(prop)) copy[prop] = o[prop];
        }
        return copy
      }
    , getDefaultUrl = function () {
        var anchor
        try {
          return location.href
        } catch (e) {
          anchor = doc.createElement('a')
          anchor.href = ''
          return anchor.href
        }
      }
    , sendLocal = function (o, deferred) {
        var http = isFunction(o.xhr) ? o.xhr() : xhr()
        http.open(o.method, o.url, true)
        setHeaders(http, o)
        http.onreadystatechange = function () {
          var status
          if (http && http[readyState] === 4) {
            status = http.status
            if (status >= 200 && status < 300 ||
                status === 304 ||
                status === 0 && http[responseText] !== '') {
              if (http[responseText])
                (responseParsers[o.dataType] || defaultParser).call(http, deferred)
              else
                deferred.resolve(null)
            } else deferred.reject(
                    new Error(o.method + ' ' + o.url + ': ' +
                      http.status + ' ' + http.statusText))
          }
        }
        try {
          http.send(o.data)
        } catch (err) {
          deferred.reject(err)
        }
      }

  return function (options) {
    var deferred = Q.defer()
      , promise = deferred.promise
      , o = options == null ? {} : clone(options)
    o.method = o.method ? o.method.toUpperCase() : 'GET'
    o.url || (o.url = getDefaultUrl())
    o.data = (o.data && o.processData !== false && typeof o.data !== 'string') ?
      toQueryString(o.data) :
      (o.data || null)
    o.dataType || (o.dataType = inferDataType(o.url))
    if (o.data && o.method === 'GET') {
      o.url = urlAppend(o.url, o.data)
      o.data = null
    }
    sendLocal(o, deferred)
    return promise;
  }
}))
