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
        var spy = originalCreateSpy(name, fn);
        spy.argsForCall = {};
        for(var i = 0; i < 10;i++){
            (function(k){                
                spy.calls[k] = {};
                Object.defineProperty(spy.calls[k], "args", {
                    get:function() {
                        return spy.calls.argsFor(k);
                    }
                });
                Object.defineProperty(spy.argsForCall, k, {
                    get:function() {
                        return spy.calls.argsFor(k);
                    }
                });
            })(i);
        }
        Object.defineProperty(spy.calls, "length", {
            get:function(){
                return spy.calls.count();
            }
        });
        
        var spyProxy = new Proxy(extend(spy, {
                callCount:0,
                mostRecentCall:{},
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
            }), {
                get: function(target, prop) {                      
                    if(prop === "callCount"){
                        return target.calls.count();
                    }
                    if(prop === 'mostRecentCall'){
                        return target.calls.mostRecent();
                    }                  
                    return target[prop];
                }
            });
        
        return spyProxy;
    }
    //CLOCK APIs : useMock and tick
    //jasmine.Clock exists already in jasmine 2 env
    global['jasmine'].Clock.useMock = function(){
        var env = jasmineBridge.getEnv();
        env.installClock();
    };
    global['jasmine'].Clock.tick = function(){
        jasmine.clock().tick(arguments);
    };
})(typeof window !== 'undefined' ? window : global);