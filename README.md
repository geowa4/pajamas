Pajamas (v0.8)
=============

Pajamas is a simple AJAX library built for use with the [Q](http://documentup.com/kriskowal/q/) promise library.

Presently, Pajamas only supports JSON and plain text.
Future versions will support more data types, like XML, JSONP, etc.

This library has been tested against Chrome (latest), FF (latest), and IE9.

[![Build Status](https://travis-ci.org/geowa4/pajamas.png)](https://travis-ci.org/geowa4/pajamas)


Usage
-----

This should look familiar to jQuery:

    var promise = pj({
        url      : '/my/awesome/data.json'  // optional; the current url is assumed
      , dataType : 'json'                   // optional; 'json' is assumed
      , data     : {                        // optional; null is assumed
          whatever : 'you want'
        }
      , type   : 'GET'                    // optional; 'GET' is assumed
    })

Then, you can do whatever you'd normally do with a Q promise, such as:

    promise.
      then(function (value) {
        // do something with the JSON
      }, function (error) {
        // error.message is of the form "<method> <url>: <status code> <status text>"
      })

POSTing your data is done in the exact same way as the GET, just change the `type` option to `"POST"`.

If you set the `dataType` to `'*'`, the promise will be resolved with the XHR object.


Options
-------

All parameters must be passed in as properties of a settings object.


### `crossDomain`

A cross-domain request can be forced by setting this value to `true`.

*Default*: inferred from URL


### `data`

Data sent to the server.
This data is converted to a query string if it is not already a string.
To avoid processing the data, set the `processData` option to `false`.

*Default*: null


### `dataType`

The type of data that you are expecting to receive back from the server.
Valid options include 
'json', 'jsonp', 'script', 'text', 'html', 'xml', and '*'.
There is an attempt to infer the data type before the request is sent,
but it is not extremely sophisticated.

*Default*: 'json' if no inference is made


### `delay`

The amount of time in milliseconds to wait to send the request.
This can be useful when simulating latency.


### `headers`

A map of header key/value pairs to send along with the request.
These key/value pairs may override the defaults like
'Accept', 'Content-Type', and 'X-Requested-With'.

*Default*: `{}` (depends on data type)


### `timeout`

The number of milliseconds to wait before aborting the request.


### `type`

The type of request to make ('GET', 'POST', 'PUT', 'DELETE').

*Default*: 'GET'


### `url`

The URL to which the request is sent.

*Default*: The current page


### `xhr`

A function to generate your own XMLHttpRequest.
This can be extremely useful when mocking your remote calls.


AMD
---

Pajamas declares 'q' as it's sole dependency.
Therefore, if q.js is not discoverable, you will likely need to define a path.
See [amd-test.js](https://github.com/geowa4/pajamas/blob/master/test/amd/amd-test.js) for an example.


Building
--------

If you would like to build Pajamas on your own you will need to do the following.

1. `npm install`
1. `npm test`

Alternatively, you can install [Grunt](http://gruntjs.com/) globally.
In the project directory, you will still need to run `npm install` to install all local dependencies.
Then, you may freely run any Grunt command defined in grunt.js.


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

### v0.7 (COMPLETE)

JSONP support; crossOrigin scripts

### v0.8 (COMPLETE)

Validate and document `processData` option.
Expose `param`, `serialize`, and `serializeArray` functions.

### v0.9

Handle timeouts.
Examine and test use of Error in 

### v0.10

Ender support.

### v1.0?

Use this for my own website.
Other criteria TBD.


References
----------

Pajamas is based upon 
@[ded](https://github.com/ded)'s [Reqwest](https://github.com/ded/reqwest) AJAX library
and [jQuery](https://github.com/jquery/jquery).
