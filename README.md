karma-jasmine-bridge.js
========

[![Build Status](https://travis-ci.org/lroche/karma-jasmine-bridge.svg?branch=master)](https://travis-ci.org/lroche/karma-jasmine-bridge)

What is it ?
-----
This plugins allows to add support of APIs from Jasmine 1 into a Jasmine 2
environment.

List of API supported:
- runs
- waitsFor
- waits
- Spy API (with limitations):
    - spy.andCallThrough();
    - spy.andCallFake(function() {});
    - spy.andThrow('error');
    - spy.andReturn(1);
    - spy.mostRecentCall.args (not supported in this version)
    - spy.callCount (not supported in this version)
    - spy.calls[0].args (not supported in this version J2: argsFor(0))
    - spy.argsForCall[0] (not supported in this version J2: calls.argsFor(0))

Why ?
-----
Because legacy applications which have a lot of tests with Jasmine need to be
moved slowly when developers remove technical debt.

So with this plugin you can run your legacy tests (Jasmine1) on a Jasmine2 environmment
without change anything (almost :)) and when you get ready you can modify your unit tests
little by little by making a migration on Jasmine 2 API.



How to install ?
-----
    npm install lroche/karma-jasmine-bridge

Adds this in your karma-conf.js

    frameworks: ['jasmine', 'jasmine-bridge'],

the order matters because bridge wraps jasmine features so plugin must be loaded after jasmine.
Here, of course it's about a jasmine 2 env.

