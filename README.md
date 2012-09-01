Qjax (v0.1.0)
=============

Qjax is a simple AJAX library built for use with the [Q](http://documentup.com/kriskowal/q/) promise library.

Presently, Qjax only supports JSON.
Future versions will support more data types, like XML, JSONP, etc.

Usage
-----

    var qPromise = Qjax({
        url      : '/my/awesome/data.json'
      , dataType : 'json'
      , method   : 'GET' // optional; 'GET' is assumed
    })

Then, you can do whatever you'd normally do with a Q promise, such as:

    qPromise.
      then(function (value) {
        // do something with the JSON
      }, function (error) {
        // error.message is of the form "<status code>: <status text>"
      })

POSTing your data is done in the exact same way as the GET, just change the `method` option to `"POST"`.