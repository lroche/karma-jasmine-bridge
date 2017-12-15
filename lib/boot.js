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
        originalCreateSpy = global['jasmine'].createSpy,
        envTest;
    
    global['it'] = function(desc, fn, timeout){
        var env = jasmineBridge.getEnv();
        envTest = env;
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
        env.beforeEach(fn);
    };
   
    global['waitsFor'] = function(){ 
        var env = jasmineBridge.getEnv();
        env.waitsFor.apply(env, arguments);
    };
    global['jasmineBridge'] = jasmineBridge;

    global['jasmine'].createSpy = function(name, fn){
        var spy = originalCreateSpy(name, fn);
        return extend(spy, {
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
            }
        });
    }
  
})(typeof window !== 'undefined' ? window : global);