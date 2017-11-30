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
jasmine.Queue = function(env) {
    this.env = env;
  
    // parallel to blocks. each true value in this array means the block will
    // get executed even if we abort
    this.ensured = [];
    this.blocks = [];
    this.running = false;
    this.index = 0;
    this.offset = 0;
    this.abort = false;
  };
  
  jasmine.Queue.prototype.addBefore = function(block, ensure) {
    if (ensure === jasmine.undefined) {
      ensure = false;
    }
  
    this.blocks.unshift(block);
    this.ensured.unshift(ensure);
  };
  
  jasmine.Queue.prototype.add = function(block, ensure) {
    if (ensure === jasmine.undefined) {
      ensure = false;
    }
  
    this.blocks.push(block);
    this.ensured.push(ensure);
  };
  
  jasmine.Queue.prototype.insertNext = function(block, ensure) {
    if (ensure === jasmine.undefined) {
      ensure = false;
    }
  
    this.ensured.splice((this.index + this.offset + 1), 0, ensure);
    this.blocks.splice((this.index + this.offset + 1), 0, block);
    this.offset++;
  };
  
  jasmine.Queue.prototype.start = function(onComplete) {
    this.running = true;
    this.onComplete = onComplete;
    this.next_();
  };
  
  jasmine.Queue.prototype.isRunning = function() {
    return this.running;
  };
  
  jasmine.Queue.LOOP_DONT_RECURSE = true;
  
  jasmine.Queue.prototype.next_ = function() {
    var self = this;
    var goAgain = true;
  
    while (goAgain) {
      goAgain = false;
      
      if (self.index < self.blocks.length && !(this.abort && !this.ensured[self.index])) {
        var calledSynchronously = true;
        var completedSynchronously = false;
  
        var onComplete = function () {
          if (jasmine.Queue.LOOP_DONT_RECURSE && calledSynchronously) {
            completedSynchronously = true;
            return;
          }
  
          if (self.blocks[self.index].abort) {
            self.abort = true;
          }
  
          self.offset = 0;
          self.index++;
  
          var now = new Date().getTime();
          if (self.env.updateInterval && now - self.env.lastUpdate > self.env.updateInterval) {
            self.env.lastUpdate = now;
            self.env.setTimeout(function() {
              self.next_();
            }, 0);
          } else {
            if (jasmine.Queue.LOOP_DONT_RECURSE && completedSynchronously) {
              goAgain = true;
            } else {
              self.next_();
            }
          }
        };
        self.blocks[self.index].execute(onComplete);
  
        calledSynchronously = false;
        if (completedSynchronously) {
          onComplete();
        }
        
      } else {
        self.running = false;
        if (self.onComplete) {
          self.onComplete();
        }
      }
    }
  };
  
  jasmine.Queue.prototype.results = function() {
    var results = new jasmine.NestedResults();
    for (var i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i].results) {
        results.addResult(this.blocks[i].results());
      }
    }
    return results;
  };
  
  
  