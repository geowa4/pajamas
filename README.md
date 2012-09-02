Qjax (v0.0.1)
=============

Qjax is a simple AJAX library built for use with the [Q](http://documentup.com/kriskowal/q/) promise library.

Presently, Qjax only supports JSON.
Future versions will support more data types, like XML, JSONP, etc.


Usage
-----

This should look familiar to jQuery:

    var qPromise = Qjax({
        url      : '/my/awesome/data.json'  // optional; '' is assumed
      , dataType : 'json'                   // optional; 'json' is assumed
      , data     : {                        // optional; null is assumed
          whatever : 'you want'
        }
      , method   : 'GET'                    // optional; 'GET' is assumed
    })

Then, you can do whatever you'd normally do with a Q promise, such as:

    qPromise.
      then(function (value) {
        // do something with the JSON
      }, function (error) {
        // error.message is of the form "<status code>: <status text>"
      })

POSTing your data is done in the exact same way as the GET, just change the `method` option to `"POST"`.


Roadmap
-------

The following is what it will take for me to call v1.0


### v0.1

This lib needs more tests; a grunt build to automate them would be nice.
Currently, I have only tested GET requests for JSON in a non-AMD environment.
I need to test POST, parsing JSON when `window.JSON` is not present, and much more.

### v0.2

Plain text support.

### v0.3

HTML support.

### v0.4

XML support.

### v0.5

JS support.

### v0.6

Handle timeouts; result function (from _)

### v1.0?

TBD