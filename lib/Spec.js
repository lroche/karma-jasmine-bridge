/**
 * Internal representation of a Jasmine specification, or test.
 *
 * @constructor
 * @param {jasmine.Env} env
 * @param {jasmine.Suite} suite
 * @param {String} description
 * @param {jasmine2.userContext} userContext
 */
JasmineBridge.Spec = function(env, suite, description, userContext) {
    if (!env) {
      throw new Error('jasmine.Env() required');
    }
    if (!suite) {
      throw new Error('jasmine.Suite() required');
    }
    var spec = this;
    spec.id = env.nextSpecId ? env.nextSpecId() : null;
    spec.env = env;
    spec.suite = suite;
    spec.description = description;
    spec.queue = new jasmine.Queue(env);
  
    spec.afterCallbacks = [];
    spec.spies_ = [];

    spec.userContext = userContext;
    spec.userContext.fail = this.fail;
  
    userContext.addMatchers = spec.addMatchers;
  };
  JasmineBridge.Spec.prototype.toString = function(){
      return "Spec Object"
  }
  JasmineBridge.Spec.prototype.getFullName = function() {
    return this.suite.getFullName() + ' ' + this.description + '.';
  };
  
  
  JasmineBridge.Spec.prototype.results = function() {
    return this.results_;
  };
  
  /**
   * All parameters are pretty-printed and concatenated together, then written to the spec's output.
   *
   * Be careful not to leave calls to <code>jasmine.log</code> in production code.
   */
  JasmineBridge.Spec.prototype.log = function() {
    return this.results_.log(arguments);
  };
  
  JasmineBridge.Spec.prototype.runs = function (func) {
    var block = new jasmine.Block(this.env, func, this.userContext);
    this.addToQueue(block);
    return this;
  };
  
  JasmineBridge.Spec.prototype.addToQueue = function (block) {
    if (this.queue.isRunning()) {
      this.queue.insertNext(block);
    } else {
      this.queue.add(block);
    }
  };
  
  /**
   * @param {jasmine.ExpectationResult} result
   */
  JasmineBridge.Spec.prototype.addMatcherResult = function(result) {
    this.results_.addResult(result);
  };
  
  JasmineBridge.Spec.prototype.expect = function(actual) {
    var positive = new (this.getMatchersClass_())(this.env, actual, this);
    positive.not = new (this.getMatchersClass_())(this.env, actual, this, true);
    return positive;
  };
  
  /**
   * Waits a fixed time period before moving to the next block.
   *
   * @deprecated Use waitsFor() instead
   * @param {Number} timeout milliseconds to wait
   */
  JasmineBridge.Spec.prototype.waits = function(timeout) {
    var waitsFunc = new jasmine.WaitsBlock(this.env, timeout, this.userContext);
    this.addToQueue(waitsFunc);
    return this;
  };
  
  /**
   * Waits for the latchFunction to return true before proceeding to the next block.
   *
   * @param {Function} latchFunction
   * @param {String} optional_timeoutMessage
   * @param {Number} optional_timeout
   */
  JasmineBridge.Spec.prototype.waitsFor = function(latchFunction, optional_timeoutMessage, optional_timeout) {
    var latchFunction_ = null;
    var optional_timeoutMessage_ = null;
    var optional_timeout_ = null;
  
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      switch (typeof arg) {
        case 'function':
          latchFunction_ = arg;
          break;
        case 'string':
          optional_timeoutMessage_ = arg;
          break;
        case 'number':
          optional_timeout_ = arg;
          break;
      }
    }
  
    var waitsForFunc = new jasmine.WaitsForBlock(this.env, optional_timeout_, latchFunction_, optional_timeoutMessage_, this.userContext);
    this.addToQueue(waitsForFunc);
    return this;
  };
  
  JasmineBridge.Spec.prototype.fail = function (e) {
    jasmine.getEnv().fail(e);
  };
  
  JasmineBridge.Spec.prototype.getMatchersClass_ = function() {
    return this.matchersClass || this.env.matchersClass;
  };
  
  JasmineBridge.Spec.prototype.addMatchers = function(matchersPrototype) {
    
    //Wraps Jasmine2 matcher to be compliant with Jasmine 1 API.
    function wrapper(matcherName, legacyMatcher){
      return function(util, customEqualityTesters){
        return { 
          compare: function(actual, expected){
            var scope = {actual: actual}, message;
            
            result = legacyMatcher.call(scope, expected)
            
            message = scope.message && scope.message()[result ? 1 : 0];
            return {
              pass:result,
              message : message
            }
          }
        }
      }
    }   
    for(var matcherName in matchersPrototype){
      var legacyMatcher = matchersPrototype[matcherName];
      matchersPrototype[matcherName] =  wrapper(matcherName, legacyMatcher);
    }
    jasmine.addMatchers(matchersPrototype);
    
  };
  
  JasmineBridge.Spec.prototype.finishCallback = function() {
    this.env.reporter.reportSpecResults(this);
  };
  
  JasmineBridge.Spec.prototype.finish = function(onComplete) {
    this.removeAllSpies();
    this.finishCallback();
    if (onComplete) {
      onComplete();
    }
  };
  
  JasmineBridge.Spec.prototype.after = function(doAfter) {
    if (this.queue.isRunning()) {
      this.queue.add(new jasmine.Block(this.env, doAfter, this), true);
    } else {
      this.afterCallbacks.unshift(doAfter);
    }
  };
  
  JasmineBridge.Spec.prototype.execute = function(onComplete) {
    var spec = this;
    /*if (!spec.env.specFilter(spec)) {
      spec.results_.skipped = true;
      spec.finish(onComplete);s
      return;
    }*/
  
    this.env.reporter.reportSpecStarting(this);
  
    //spec.env.currentSpec = spec;
  
    //spec.addBeforesAndAftersToQueue();
  
    spec.queue.start(function () {
      spec.finish(onComplete);
    });
  };
  
  JasmineBridge.Spec.prototype.addBeforesAndAftersToQueue = function() {
    var runner = this.env.currentRunner();
    var i;
  
    for (var suite = this.suite; suite; suite = suite.parentSuite) {
      for (i = 0; i < suite.before_.length; i++) {
        this.queue.addBefore(new jasmine.Block(this.env, suite.before_[i], this));
      }
    }
    for (i = 0; i < runner.before_.length; i++) {
      this.queue.addBefore(new jasmine.Block(this.env, runner.before_[i], this));
    }
    for (i = 0; i < this.afterCallbacks.length; i++) {
      this.queue.add(new jasmine.Block(this.env, this.afterCallbacks[i], this), true);
    }
    for (suite = this.suite; suite; suite = suite.parentSuite) {
      for (i = 0; i < suite.after_.length; i++) {
        this.queue.add(new jasmine.Block(this.env, suite.after_[i], this), true);
      }
    }
    for (i = 0; i < runner.after_.length; i++) {
      this.queue.add(new jasmine.Block(this.env, runner.after_[i], this), true);
    }
  };
  
  JasmineBridge.Spec.prototype.explodes = function() {
    throw 'explodes function should not have been called';
  };
  
  JasmineBridge.Spec.prototype.spyOn = function(obj, methodName, ignoreMethodDoesntExist) {
    if (obj == jasmine.undefined) {
      throw "spyOn could not find an object to spy upon for " + methodName + "()";
    }
  
    if (!ignoreMethodDoesntExist && obj[methodName] === jasmine.undefined) {
      throw methodName + '() method does not exist';
    }
  
    if (!ignoreMethodDoesntExist && obj[methodName] && obj[methodName].isSpy) {
      throw new Error(methodName + ' has already been spied upon');
    }
  
    var spyObj = jasmine.createSpy(methodName);
  
    this.spies_.push(spyObj);
    spyObj.baseObj = obj;
    spyObj.methodName = methodName;
    spyObj.originalValue = obj[methodName];
  
    obj[methodName] = spyObj;
  
    return spyObj;
  };
  
  JasmineBridge.Spec.prototype.removeAllSpies = function() {
    for (var i = 0; i < this.spies_.length; i++) {
      var spy = this.spies_[i];
      spy.baseObj[spy.methodName] = spy.originalValue;
    }
    this.spies_ = [];
  };
  
  