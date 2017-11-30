karma-jasmine-bridge.js
========

What is it ?
-----
This plugins allows to add support of APIs from Jasmine 1 into a Jasmine 2
environment.

List of API supported:
- runs
- waitsFor
- waits (not in this version)

Why ?
-----
Because legacy applications which have a lot of tests with Jasmine1 need to
move slowly when it removes technical debt.
So with this plugin you can run your legacy tests (Jasmine1) on a Jasmine2 environmment
without change anything (almost :))



How to install ?
-----
    npm install lroche/karma-jasmine-bridge

Adds this in your karma-conf.js

    frameworks: ['jasmine', 'jasmine-bridge'],

the order matters because bridge wraps jasmine features so plugin must be loaded after jasmine.
Here, of course it's about a jasmine 2 env.

