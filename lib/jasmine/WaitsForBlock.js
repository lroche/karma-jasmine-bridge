/*
Copyright (c) 2008-2011 Pivotal Labs

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * A block which waits for some condition to become true, with timeout.
 *
 * @constructor
 * @extends jasmine.Block
 * @param {jasmine.Env} env The Jasmine environment.
 * @param {Number} timeout The maximum time in milliseconds to wait for the condition to become true.
 * @param {Function} latchFunction A function which returns true when the desired condition has been met.
 * @param {String} message The message to display if the desired condition hasn't been met within the given time period.
 * @param {jasmine.Spec} spec The Jasmine spec.
 */
jasmine.WaitsForBlock = function(env, timeout, latchFunction, message, spec) {
    this.timeout = timeout || env.defaultTimeoutInterval;
    this.latchFunction = latchFunction;
    this.message = message;
    this.totalTimeSpentWaitingForLatch = 0;
    jasmine.Block.call(this, env, null, spec);
  };
  jasmine.util.inherit(jasmine.WaitsForBlock, jasmine.Block);
  
  jasmine.WaitsForBlock.TIMEOUT_INCREMENT = 10;
  
  jasmine.WaitsForBlock.prototype.execute = function(onComplete) {
    if (jasmine.VERBOSE) {
      this.env.reporter.log('>> Jasmine waiting for ' + (this.message || 'something to happen'));
    }
    var latchFunctionResult;
    try {
      latchFunctionResult = this.latchFunction.apply(this.spec);
    } catch (e) {
      this.spec.fail(e);
      onComplete();
      return;
    }
  
    if (latchFunctionResult) {
      onComplete();
    } else if (this.totalTimeSpentWaitingForLatch >= this.timeout) {
      var message = 'timed out after ' + this.timeout + ' msec waiting for ' + (this.message || 'something to happen');
      this.spec.fail({
        name: 'timeout',
        message: message
      });
  
      this.abort = true;
      onComplete();
    } else {
      this.totalTimeSpentWaitingForLatch += jasmine.WaitsForBlock.TIMEOUT_INCREMENT;
      var self = this;
      this.env.setTimeout(function() {
        self.execute(onComplete);
      }, jasmine.WaitsForBlock.TIMEOUT_INCREMENT);
    }
  };
  