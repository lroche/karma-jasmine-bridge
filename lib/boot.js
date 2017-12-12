;(function(global) {

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

    global['jasmine'].createSpy = function(name){
        var spy = originalCreateSpy(name);
        return {
            andCallThrough: function(){
                return spy.and.andCallThrough();
            },
            andCallFake: function(fn){
                return spy.and.callFake(fn);
            },
            andThrow: function(errorString){
                return spy.and.throwError(errorString);
            },
            andReturn: function(number){
                return spy.and.returnValue(1);
            }
        }
    }
  
})(typeof window !== 'undefined' ? window : global);