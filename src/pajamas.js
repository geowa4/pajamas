!(function (factory) {
  if (typeof module !== 'undefined' && typeof module.exports === 'object')
    module.exports = factory(require('q'))
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
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , defaultHeaders = {
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8'
      , Accept      : {
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

    , isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n)
      }

    , defaults = function (o, d) {
        var prop

        for (prop in d) {
          if (!o.hasOwnProperty(prop) && d.hasOwnProperty(prop))
            o[prop] = d[prop]
        }

        return o
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

    , makeResolution = function (http, response, verboseResolution) {
        if (verboseResolution)
          return {
            response : response
          , status   : http.status
          , xhr      : http
          }
        else return response
      }

    , responseParsers = {
        json   : function () {
          var r = this.responseText, e

          try {
            return win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
          } catch (err) {
            e = new Error('Could not parse JSON in response.')
            throw e
          }
        }
      , script : function () {
          return eval(this.responseText)
        }
      , text   : function () {
          return String(this.responseText)
        }
      , html   : function () {
          return this.responseText
        }
      , xml    : function () {
          var r = this.responseXML
          // Chrome makes `responseXML` null;
          // IE makes `documentElement` null;
          // FF makes up an element;
          // this is my attempt at standardization
          if (r === null || r.documentElement === null ||
              r.documentElement.nodeName === 'parsererror')
            return null
          else return r
        }
      }

    , isCrossDomain = function (url, defaultUrl) {
        var parts = rurl.exec(url)
          , defaultParts = rurl.exec(defaultUrl)
        return !!(parts &&
          (parts[1] !== defaultParts[1] || parts[2] !== defaultParts[2] ||
            (parts[3] || (parts[1] === 'http:' ? 80 : 443)) !==
              (defaultParts[3] || (defaultParts[1] === 'http:' ? 80 : 443 ))))
      }

    , sendLocal = function (o, deferred) {
        var http = isFunction(o.xhr) ? o.xhr() : xhr()
          , timeoutVal
          , send = function () {
              try {
                http.send(o.data)
              } catch (err) {
                err.xhr = http
                deferred.reject(err)
              }
            }

        http.open(o.type, o.url, true)
        setHeaders(http, o)

        http.onreadystatechange = function () {
          var status
            , parser
            , err

          timeoutVal && clearTimeout(timeoutVal)

          if (http && http[readyState] === 4) {
            status = http.status
            if (status >= 200 && status < 300 ||
                status === 304 ||
                status === 0 && http.responseText !== '') {
              if (http.responseText) {
                try {
                  parser = responseParsers[o.dataType]
                  deferred.resolve(makeResolution(
                    http
                  , parser ? parser.call(http) : http
                  , o.verboseResolution))
                } catch (e) {
                  e.xhr = http
                  deferred.reject(e)
                }
              }
              else
                deferred.resolve(makeResolution(
                  http
                , null
                , o.verboseResolution))
            }
            else {
              err = new Error(o.type + ' ' + o.url + ': ' + http.status + ' ' +
                http.statusText)
              err.type = o.type
              err.url = o.url
              err.status = http.status
              err.statusText = http.statusText
              err.xhr = http
              deferred.reject(err)
            }
          }
        }

        if (isNumeric(o.timeout)) {
          timeoutVal = setTimeout(function() {
            var e = new Error('timeout')
            e.xhr = http
            http.abort()
            deferred.reject(e)
          }, o.timeout)
        }

        isNumeric(o.delay) ?
          setTimeout(function () {
            send()
          }, o.delay) :
          send()
      }

    , sendRemote = function (o, deferred) {
        var head = document.head || document.getElementsByTagName('head')[0] ||
            document.documentElement
          , script = document.createElement('script')
          , callbackName
          , callback
          , timeoutVal
          , send = function () {
              script && head.appendChild(script)
            }

        script.async = 'async'
        if (o.dataType === 'jsonp') {
          callbackName =  o.jsonp || 'pajamas' +
            (Date.now || function () { return (new Date()).getTime() }).call()
          callback = function (data) {
            window[callbackName] = undefined
            try {
              delete window[callbackName]
            } catch (e) {}
            deferred.resolve(data)
          }
          window[callbackName] = callback
          o.url += (o.url.indexOf('?') > -1 ? '&' : '?') +
            (o.jsonp || 'callback') + '=' + callbackName
          script.src = o.url
        }
        else {
          script.src = o.url
        }

        script.onload = script.onreadystatechange = function(_, isAbort) {
          if (isAbort || !script.readyState ||
            /loaded|complete/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;
            if (head && script.parentNode) {
              head.removeChild(script)
            }
            script = undefined
            timeoutVal && clearTimeout(timeoutVal)

            if (!isAbort) {
              if (o.dataType !== 'jsonp') deferred.resolve()
            }
            else {
              deferred.reject(new Error(o.url + ' aborted'))
            }
          }
        }

        if (isNumeric(o.timeout)) {
          timeoutVal = setTimeout(function() {
            script.onload(0, 1)
            deferred.reject(new Error('timeout'))
          }, o.timeout)
        }

        isNumeric(o.delay) ?
          setTimeout(function () {
            send()
          }, o.delay) :
          send()
      }
    , pajamas = function (options) {
        var deferred = Q.defer()
          , promise = deferred.promise
          , o = options == null ? {} : defaults({}, options)
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

        o.type = o.type ? o.type.toUpperCase() : 'GET'
        o.url || (o.url = defaultUrl)
        o.data = (o.data && o.processData !== false &&
            typeof o.data !== 'string') ?
          pajamas.param(o.data) :
          (o.data || null)
        o.dataType || (o.dataType = inferDataType(o.url))
        o.crossDomain != null || (o.crossDomain = isCrossDomain(o.url, defaultUrl))

        if (o.data && typeof o.data === 'string' && o.type === 'GET') {
          o.url = urlAppend(o.url, o.data)
          o.data = null
        }

        if (!o.crossDomain && o.dataType !== 'jsonp') sendLocal(o, deferred)
        else sendRemote(o, deferred)

        return promise
        .then(function (value) {
          var ret = o.success && o.success(value)
          return ret || value
        }, function (reason) {
          var ret
          // retry as many times as desired
          if (isNumeric(o.retry) && o.retry > 0) {
            o.retry--
            return pajamas(o)
          }
          else if (o.retry === Object(o.retry)) {
            return pajamas(o.retry)
          }
          ret = o.error && o.error(reason)
          if (ret) return ret
          // throw reason if o.error didn't throw or return
          throw reason
        })
      }

  pajamas.partial = function (outer) {
    return function (inner) {
        return pajamas(defaults(outer || {}, inner || {}))
      }
  }

  pajamas.param = function (data) {
    var prefix
      , queryStringBuilder = []

      , push = function(key, value) {
          var enc = encodeURIComponent

          value = isFunction(value) ?
            value() :
            (value == null ? '' : value)
          queryStringBuilder.push(enc(key) + '=' + enc(value))
        }

      , buildParams = function (prefix, obj) {
          var name
            , i
            , v

          if (isArray(obj)) {
            for (i = 0; i < obj.length; i++) {
              v = obj[i]
              if (/\[\]$/.test(prefix)) {
                push(prefix, v)
              }
              else {
                buildParams(
                  prefix + '[' + (typeof v === 'object' ? i : '') + ']'
                , v)
              }
            }
          }
          else if (obj && typeof obj === 'object') {
            for (name in obj) {
              if (obj.hasOwnProperty(name))
                buildParams(prefix + '[' + name + ']', obj[name])
            }
          }
          else push(prefix, obj)
        }

    if (isArray(data)) { // assume output from serializeArray
      for (prefix = 0; prefix < data.length; prefix++) {
        push(data[prefix].name, data[prefix].value)
      }
    }
    else {
      for (prefix in data) {
        if (data.hasOwnProperty(prefix))
          buildParams(prefix, data[prefix])
      }
    }

    return queryStringBuilder.join('&').replace(/%20/g, '+')
  }

  pajamas.val = function (el) {
    var v

    if (el.nodeName.toLowerCase() === 'select') {
      v = (function () {
        var v
          , vals = []
          , selectedIndex = el.selectedIndex
          , opt
          , options = el.options
          , isSingleSelect = el.type === 'select-one'
          , i
          , max

        if (selectedIndex < 0) return null

        i = isSingleSelect ? selectedIndex : 0;
        max = isSingleSelect ? selectedIndex + 1 : options.length;
        for (; i < max; i++) {
          opt = options[i]

          if (opt.selected && !opt.disabled &&
              (!opt.parentNode.disabled ||
                opt.parentNode.nodeName.toLowerCase() !== 'optgroup')) {
            v = pajamas.val(opt)

            if (isSingleSelect) return v
            vals.push(v)
          }
        }

        return vals
      } ())
    }
    else if (el.nodeName.toLowerCase() === 'option') {
      v = el.attributes.value;
      return !v || v.specified ? el.value : el.text;
    }
    else if (el.type === 'button' ||
        el.nodeName.toLowerCase() === 'button') {
      v = el.getAttributeNode('value')
      return v ? v.value : undefined
    }
    else if (el.type === 'radio' || el.type === 'checkbox') {
      return el.getAttribute('value') === null ? 'on' : el.value
    }
    else {
      v = el.value;
    }

    return typeof v === 'string' ?
      v.replace(/\r/g, '') :
      v == null ? '' : v;
  }

  pajamas.serializeArray = function () {
    var arr = []
      , i
      , el
      , crlf = /\r?\n/g
      , checkableType = /radio|checkbox/i
      , pushAll = function (elems) {
          var el
            , v
            , i
            , j
          for (i = 0; i < elems.length; i++) {
            el = elems[i]
            if (el.name && !el.disabled &&
                (checkableType.test(el.type) ? el.checked : true)) {
              v = pajamas.val(el)
              if (v != null) {
                if (isArray(v)) { // from multiple select, for instance
                  for (j = 0; j < v.length; j++) {
                    arr.push({
                        name  : el.name
                      , value : v[j].replace(crlf, '\r\n')
                    })
                  }
                }
                else {
                  arr.push({
                      name  : el.name
                    , value : v.replace(crlf, '\r\n')
                  })
                }
              }
            }
          }
        }
    for (i = 0; i < arguments.length; i++) {
      el = arguments[i]
      el.elements ? pushAll(el.elements) : pushAll([el])
    }
    return arr
  }
  pajamas.serialize = function (){
    return pajamas.param(pajamas.serializeArray.apply(null, arguments))
  }

  return pajamas
}));