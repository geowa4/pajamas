Pajamas (v0.10.0)
================

Pajamas is a simple AJAX library built for use with the [Q](http://documentup.com/kriskowal/q/) promise library.

Presently, Pajamas only supports JSON and plain text.
Future versions will support more data types, like XML, JSONP, etc.

This library has been tested against Chrome (latest), FF (latest), and IE9.

[![Build Status](https://travis-ci.org/geowa4/pajamas.png)](https://travis-ci.org/geowa4/pajamas)


Usage
-----

Using the `pj` function, pass an object of options.
This should look familiar to jQuery:

    var promise = pj({
        url      : '/my/awesome/data.json'  // optional; the current url is assumed
      , dataType : 'json'                   // optional; 'json' is assumed
      , data     : {                        // optional; null is assumed
          whatever : 'you want'
        }
      , type     : 'GET'                    // optional; 'GET' is assumed
    })

Then, you can do whatever you'd normally do with a Q promise, such as:

    promise
    .then(function (value) {
        // do something with the JSON
      }
    , function (error) {
        // error.message is of the form "<method> <url>: <status code> <status text>"
      })

POSTing your data is done in the exact same way as the GET, just change the `type` option to `"POST"`.
If you set the `dataType` to `'*'`, the promise will be resolved with the XHR object.
See more options below.


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
For scripts (including JSONP), this will cause the script tag to be removed from the DOM.


### `type`

The type of request to make ('GET', 'POST', 'PUT', 'DELETE').

*Default*: 'GET'


### `url`

The URL to which the request is sent.

*Default*: The current page


### `xhr`

A function to generate your own XMLHttpRequest.
This can be extremely useful when mocking your remote calls.


Serialization
-------------

Pajamas has three methods for serialization: `param`, `serialize`, and `serializeArray`.
See [serialization-test.js](https://github.com/geowa4/pajamas/blob/master/test/serialization/serialization-test.js)
for more detailed examples than what's below.


### `pj.serialize(elements...)`

Takes form and input elements as a variable number of arguments.
Returns a query string representing the form.


### `pj.serializeArray(elements...)`

Takes form and input elements as a variable number of arguments.
Returns an array of objects of the following form:

    [
        {
            name  : 'elemName'
          , value : 'elemValue'
        }
      , {
            name  : 'otherName'
          , value : 'otherValue'
        }
    ]


### `pj.param(objectOrArray)`

Takes an object or an array and returns a query string.
If an Array is passed in, it assumes the format returned by `pj.serializeArray`.

    > pj.param({foo:'bar', baz:'quux'})
    'foo=bar&baz=quux'

    > pj.param([{name:'foo', value:'bar'}, {name:'baz', value:'quux'}])
    'foo=bar&baz=quux'


AMD
---

Pajamas declares 'q' as it's sole dependency.
Therefore, if q.js is not discoverable, you will likely need to define a path.
See [amd-test.js](https://github.com/geowa4/pajamas/blob/master/test/amd/amd-test.js) for an example.


Ender
-----

When using Ender, Pajamas can be accessed without alteration using Ender's mock CommonJS implementation.

    var pj = require('pajamas')

Since Pajamas requires Q, Q's static methods are added to `ender` (a.k.a `$`) as well.

    $.when(valueOrPromise)
    require('Q').when(valueOrPromise)

The static method `param` is added without modification to Ender.

    $.param(objectOrArray)

The static methods `serialize` and `serializeArray` require DOM elements so they are added to `ender.fn`.
The modification simply applies the internal collection as arguments to `pj.serialize` and `pj.serializeArray`.

    $('#form').serialize()
    $('#form').serializeArray()


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

### v1.0

Use this for my own website.
Cleanup.


References
----------

Pajamas is based upon 
@[ded](https://github.com/ded)'s [Reqwest](https://github.com/ded/reqwest) AJAX library
and [jQuery](https://github.com/jquery/jquery).
