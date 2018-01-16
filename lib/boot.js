;(function(global) {
    function extend(destination, source) {
        for (var k in source) {
          if (source.hasOwnProperty(k)) {
            destination[k] = source[k];
          }
        }
        return destination; 
    }
    var jasmineBridge = new JasmineBridge(),
        originalCreateSpy = global['jasmine'].createSpy;
    
    global['it'] = function(desc, fn, timeout){
        var env = jasmineBridge.getEnv();
        return env.it.apply(env, arguments);
    
    };
    global['fit'] = function(desc, fn, timeout){
        var env = jasmineBridge.getEnv();
        return env.fit.apply(env, arguments);
    
    };
    global['runs'] = function(fn){ 
        var env = jasmineBridge.getEnv();
        env.runs(fn);
    };

    global['beforeEach'] = function(fn){
        var env = jasmineBridge.getEnv();
        env.beforeEach.apply(env, arguments);
    };

    global['afterEach'] = function(fn){
        var env = jasmineBridge.getEnv();
        env.afterEach.apply(env, arguments);
    };

    global['waits'] = function() {
        var env = jasmineBridge.getEnv();
        env.waits.apply(env, arguments);
    };
    global['waitsFor'] = function(){ 
        var env = jasmineBridge.getEnv();
        env.waitsFor.apply(env, arguments);
    };
    global['jasmineBridge'] = jasmineBridge;

    global['jasmine'].createSpy = function(name, fn){
        var spy = originalCreateSpy(name, fn),
            spyProxy = new Proxy(spy, {
                get: function(target, prop) {                    
                    if(prop === "callCount"){
                        return target.calls.count();
                    }                    
                    return target[prop];
                }
            })
        return extend(spyProxy, {
            andCallThrough: function(){
                return spy.and.callThrough();
            },
            andCallFake: function(fn){
                return spy.and.callFake(fn);
            },
            andThrow: function(errorString){
                return spy.and.throwError(errorString);
            },
            andReturn: function(value){
                return spy.and.returnValue(value);
            },
            reset: function(){
                spy.calls.reset();
            }
        });
    }
  
})(typeof window !== 'undefined' ? window : global);