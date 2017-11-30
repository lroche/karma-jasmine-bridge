;(function(global) {

    var jasmineBridge = new JasmineBridge();
    var envTest;
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
   
    global['waitsFor'] = function(){ 
        var env = jasmineBridge.getEnv();
        env.waitsFor.apply(env, arguments);
    };
    global['jasmineBridge'] = jasmineBridge;
  
})(typeof window !== 'undefined' ? window : global);