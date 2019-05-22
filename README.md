karma-jasmine-bridge.js
========

[![Build Status](https://travis-ci.org/lroche/karma-jasmine-bridge.svg?branch=master)](https://travis-ci.org/lroche/karma-jasmine-bridge)

What is it ?
-----
This plugins allows to add support of APIs from Jasmine 1 into Jasmine 2 and Jasmine 3
environment.

List of API supported:
- runs
- waitsFor
- waits
- Spy API :
    - spy.andCallThrough();
    - spy.andCallFake(function() {});
    - spy.andThrow('error');
    - spy.andReturn(1);
    - spy.reset()
    - spy.callCount 
    - spy.mostRecentCall.args
    - spy.calls[0].args 
    - spy.argsForCall[0]
- Clock API:
    - useMock()
    - tick()
- CustomMatcher API


Why ?
-----
Because legacy applications which have a lot of tests with Jasmine need to be
moved slowly when developers remove technical debt.

So with this plugin you can run your legacy tests (Jasmine1) on a Jasmine2 environmment
without change anything (almost :)) and when you get ready you can modify your unit tests
little by little by making a migration on Jasmine 2 API.



How to install ?
-----
    npm install karma-jasmine-bridge

Adds this in your karma-conf.js

    frameworks: ['jasmine-bridge', 'jasmine'],

the order matters because bridge wraps jasmine features so plugin must be loaded before jasmine.
Here, of course it's about a jasmine 2 or 3 env.

Tests
-----
![](https://bstacksupport.zendesk.com/attachments/token/tbRCfrBWnXPCzzCEl6txLWWqH/?name=browserstack-logo-600x315.png)

This project is tested with browserstack platform. I choose this platform because automate system is very easy to be configured and result is quick. Thanks to help me to have a complete environnement.

Supported Browsers : IE > 9 , Firefox, Chrome, Safari (see karma-conf to have complete list of platforms.)

