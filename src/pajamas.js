!(function (factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory(require('q'))
  else if (typeof define === 'function' && define.amd) define(['q'], factory)
  else this['pj'] = factory(this['Q'])
} (function (Q) {
  var win = window
    , doc = document
    , rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
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
        if (typeof dataString !== 'string') return url
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
    , isCrossDomain = function (url, defaultUrl) {
        var parts = rurl.exec(url)
          , defaultParts = rurl.exec(defaultUrl)
        return !!(parts &&
          (parts[1] !== defaultParts[1] || parts[2] !== defaultParts[2] ||
            (parts[3] || (parts[1] === "http:" ? 80 : 443)) !==
              (defaultParts[3] || (defaultParts[1] === "http:" ? 80 : 443 ))))
      }
    , sendRemote = function (o, deferred) {
        var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
          , script = document.createElement('script')
          , callbackName
          , callback
        script.async = 'async'
        if (o.dataType === 'jsonp') {
          callbackName =  o.jsonp || 'pajamas' + (Date.now || function () { return (new Date()).getTime() }).call()
          callback = function (data) {
            delete window[callbackName]
            deferred.resolve(data)
          }
          window[callbackName] = callback
          //TODO: need timeout or this can never be rejected
          o.url += (o.url.indexOf('?') > -1 ? '&' : '?') + (o.jsonp || 'callback') + '=' + callbackName
          script.src = o.url
        }
        else {
          script.src = o.url
        }
        script.onload = script.onreadystatechange = function(_, isAbort) {
          if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;
            if (head && script.parentNode) {
              head.removeChild(script);
            }
            script = undefined;
            if (!isAbort) {
              if (o.dataType !== 'jsonp') deferred.resolve()
            }
          else deferred.reject(new Error(o.url + ' aborted'))
          }
        }
        head.appendChild(script)
      }

  return function (options) {
    var deferred = Q.defer()
      , promise = deferred.promise
      , o = options == null ? {} : clone(options)
      , defaultUrl = (function () {
          var anchor
          try {
            return location.href
          } catch (e) {
            anchor = doc.createElement('a')
            anchor.href = ''
            return anchor.href
          }
        } ())
    o.method = o.method ? o.method.toUpperCase() : 'GET'
    o.url || (o.url = defaultUrl)
    o.data = (o.data && o.processData !== false && typeof o.data !== 'string') ?
      toQueryString(o.data) :
      (o.data || null)
    o.dataType || (o.dataType = inferDataType(o.url))
    o.crossDomain || (o.crossDomain = isCrossDomain(o.url, defaultUrl))
    if (o.data && o.method === 'GET') {
      o.url = urlAppend(o.url, o.data)
      o.data = null
    }
    if (!o.crossDomain && o.dataType !== 'jsonp') sendLocal(o, deferred)
    else sendRemote(o, deferred)
    return promise;
  }
}))
