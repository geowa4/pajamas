Pajamas
=======
  
Pajamas is a simple, well-tested AJAX library built for use with the [Q](http://documentup.com/kriskowal/q/) promise library.
This library has been tested against Chrome (latest), FF (latest), and IE9.
See the [package.json](https://github.com/geowa4/pajamas/blob/master/package.json) file for the current version number and tested dependencies.

[![Build Status](https://travis-ci.org/geowa4/pajamas.png)](https://travis-ci.org/geowa4/pajamas)
[![Dependency Status](https://gemnasium.com/geowa4/pajamas.png)](https://gemnasium.com/geowa4/pajamas)


Usage
-----

Using the `pj` function, pass an object of options.
This should look familiar to jQuery:

    var promise = pj({
      url      : '/my/awesome/data.json'  // optional; the current URL is assumed
    , dataType : 'json'                   // optional; 'json' is assumed
    , data     : {                        // optional; `null` is assumed
        whatever : 'you want'
      }
    , type     : 'GET'                    // optional; 'GET' is assumed
    })

Then, you can do whatever you'd normally do with a Q promise, such as:

    promise
    .then(function (value) {
      // do something with the JSON
    }, function (reason) {
      // reason is an instance of Error
      // see reason.type, reason.url, reason.status, reason.statusText, and reason.xhr
    })

POSTing your data is done in the exact same way as the GET, just change the `type` option to `"POST"`.
If you set the `dataType` to `'*'`, the promise will be resolved with the XHR object.
See more options below.


Options
-------

All parameters must be passed in as properties of a settings object.


### crossDomain

A cross-domain request can be forced by setting this value to `true`.

*Default*: inferred from URL


### contentType

The value for the `Content-Type` header.

*Default*: 'application/x-www-form-urlencoded; charset=UTF-8'


### data

Data sent to the server.
This data is converted to a query string if it is not already a string.
To avoid processing the data, set the `processData` option to `false`.

*Default*: null


### dataType

The type of data that you are expecting to receive back from the server.
Valid options include 
'json', 'jsonp', 'script', 'text', 'html', 'xml', and '*'.
There is an attempt to infer the data type before the request is sent,
but it is not extremely sophisticated.

*Default*: 'json' if no inference is made


### delay

The amount of time in milliseconds to wait to send the request.
This can be useful when simulating latency.


### error

The default rejection handler for the generated promise.
This is passed to the `then` function of the promise;
the promise returned from `then` is what is returned to the user.
If the error handler returns anything, that value is returned, resolving the promise.
If nothing is returned or undefined is returned, the parameter to the rejection handler is rethrown.
These conditions are necessary for compatilibility with existing libraries like Backbone.

*Default*: function (reason) { throw reason }


### headers

A map of header key/value pairs to send along with the request.
These key/value pairs may override the defaults like
'Accept', 'Content-Type', and 'X-Requested-With'.

*Default*: `{}` (depends on data type)


### retry

An integer for the number of times the request should be retried
with a nearly identical set of options. 
The only changes will be a decremented retry count,
and all inferences (`type`, `dataType`, `url`) will be passed along to avoid having to make the same inferences again.

If `retry` is an object, that will be used as the options object for the retry.
This retry object may also have a retry property.


### success

The default fulfillment handler for the generated promise.
This is passed to the `then` function of the promise;
the promise returned from `then` is what is returned to the user.
If the success handler returns anything, that value is returned, resolving the promise.
If nothing is returned or undefined is returned, the parameter to the fulfillment handler is returned.
If the success handler throws an exception, this will reject the promise.
These conditions are necessary for compatilibility with existing libraries like Backbone.

*Default*: function (value) { return value }


### timeout

The number of milliseconds to wait before aborting the request.
For scripts (including JSONP), this will cause the script tag to be removed from the DOM.


### type

The type of request to make ('GET', 'POST', 'PUT', 'DELETE').

*Default*: 'GET'


### url

The URL to which the request is sent.

*Default*: The current page


### verboseResolution

If this is set to a truthy value, the resolution of the local (not cross domain and not JSONP) will be an object with three fields: `response`, `status`, and `xhr`.
The `response` field is the normal response that you would normally have received as the resolution value.
The `status` field is the status code of the response (i.e. 200, 304, etc.).
The `xhr` field is the XHR object that was used to make the request.

*Default*: undefined


### xhr

A function to generate your own XMLHttpRequest.
This can be extremely useful when mocking your remote calls.


Serialization
-------------

Pajamas has three methods for serialization: `param`, `serialize`, and `serializeArray`.
A fourth function, `val`, which is necessary for serializing form elements, is also available.
See [serialization-test.js](https://github.com/geowa4/pajamas/blob/master/test/serialization/serialization-test.js)
for more detailed examples than what's below.


### pj.serialize(elements...)

Takes form and input elements as a variable number of arguments.
Returns a query string representing the form.


### pj.serializeArray(elements...)

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


### pj.val(element)

Takes a form element and returns its value.
Returns null if there is no value.


### pj.param(objectOrArray)

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

    > var pj = require('pajamas')

Since Pajamas requires Q, Q's static methods are added to `ender` (a.k.a `$`) as well.

    > $.when(valueOrPromise)
    > require('Q').when(valueOrPromise)

The static method `ajax` is added to Ender and is equivalent to `require('pajamas')`.

    > $.ajax({url : 'some.json'}).then(function (json) { ... })

The static method `param` is added without modification to Ender.

    > $.param(objectOrArray)

The static methods `serialize`, `serializeArray`, and `val` require DOM elements so they are added to `ender.fn`.
The modification simply applies the internal collection as arguments to `pj.serialize` and `pj.serializeArray`.

    > $('#form').serialize()
    > $('#form').serializeArray()
    > $('#username').val()


Partial Application
-------------------

Methods are often created to wrap an AJAX call with the intention of pre-canning a bunch of options.
That is no longer necessary.
Using `pj.partial` you can achieve the same goal.

    > var get = pj.partial({type : 'GET'})

Or, if you're using Ender:

    > $.post({url : 'some/form'})
    > $.get({url : 'some.xml'})
    > $.getJSON({url : '/some/resource'})
    > $.getScript({url : 'some.js'})


Building
--------

If you would like to build Pajamas on your own you will need to do the following.

1. `npm install`
1. `npm test`

Alternatively, you can install [Grunt](http://gruntjs.com/) globally.
In the project directory, you will still need to run `npm install` to install all local dependencies.
Then, you may freely run any Grunt command defined in grunt.js.


References
----------

Pajamas is based upon 
@[ded](https://github.com/ded)'s [Reqwest](https://github.com/ded/reqwest) AJAX library
and [jQuery](https://github.com/jquery/jquery).
