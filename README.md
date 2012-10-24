Qjax (v0.6)
=============

Qjax is a simple AJAX library built for use with the [Q](http://documentup.com/kriskowal/q/) promise library.

Presently, Qjax only supports JSON and plain text.
Future versions will support more data types, like XML, JSONP, etc.

This library has been tested against Chrome (latest), FF (latest), and IE9.


Usage
-----

This should look familiar to jQuery:

    var qPromise = qjax({
        url      : '/my/awesome/data.json'  // optional; the current url is assumed
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
        // error.message is of the form "<method> <url>: <status code> <status text>"
      })

POSTing your data is done in the exact same way as the GET, just change the `method` option to `"POST"`.

If you set the `dataType` to `'*'`, the promise will be resolved with the XHR object.


AMD
---

Qjax declares 'q' as it's sole dependency.
Therefore, if q.js is not discoverable, you will likely need to define a path.
See [amd-test.js](https://github.com/geowa4/qjax/blob/master/test/amd/amd-test.js) for an example.


Building
--------

If you would like to build Qjax on your own you will need to do the following.

1. As root or Administrator, install [grunt](https://github.com/cowboy/grunt) 
   (`npm install -g grunt`).
1. Navigate to the project's root, and 
   install [grunt-contrib](https://github.com/gruntjs/grunt-contrib) 
   (`npm install grunt-contrib`).
1. Run grunt (`grunt`).


Roadmap
-------

The following is what it will take for me to call v1.0


### v0.1 (COMPLETE)

This lib needs more tests; a grunt build to automate them would be nice.
Currently, I have only tested GET requests for JSON in a non-AMD environment.
I need to test POST, parsing JSON when `window.JSON` is not present, and much more.

### v0.1.1 (COMPLETE)

Test with [RequireJS](http://requirejs.org/).
Test in FF (latest) and IE9.

### v0.2 (COMPLETE)

Plain text support.

### v0.3 (COMPLETE)

HTML support.

### v0.4 (COMPLETE)

XML support.

### v0.5 (COMPLETE)

JS support.

### v0.6 (COMPLETE)

Default parser (`Accepts: *`).
Better tests with mock XHR.

### v0.7

Handle timeouts.

### v0.8

JSONP support; crossOrigin scripts

### v0.9

Validate and document `processData` option.
Test against bad options.

### v1.0?

Use this for my own website.
Other criteria TBD.


References
----------

Qjax is based upon @[ded](https://github.com/ded)'s [Reqwest](https://github.com/ded/reqwest) AJAX library.
In fact, after reading through it's source I decided to try out his code style (with some modifications).
