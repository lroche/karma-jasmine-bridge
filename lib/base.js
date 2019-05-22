
var JasmineBridge = function(){
    var currentEnv;
    this.getEnv = function(){
        currentEnv = currentEnv || new Env(jasmine.getEnv());
        return currentEnv;
    };
    this.getCreateSpyFn = function(global){
        if(isJasmineV3()){
            return global['jasmine'].getEnv().createSpy;
        }
        return global['jasmine'].createSpy;
    };
    this.decorate = function(global, name, newFn){
        if(isJasmineV3()){ 
            global['jasmine'].getEnv()[name] = newFn; 
        }else{
            global['jasmine'][name] = newFn;
        }
    };
    //Env is a mixin between legacy jasmine env and jasmine 2 env.
    function Env(jasmineEnv){
        this.env = jasmineEnv;
        //
        this.setTimeout = function(){
            return jasmine.getGlobal().setTimeout.apply(jasmine.getGlobal(), arguments);
        }
        this.reporter = {reportSpecStarting:function(){},
                         reportSpecResults:function(){},
                         log:function(){console.log(arguments);}
                        };
        
        this.currentSpec = null;
        this.installedMockClock = false;

        var callAPI = function(api, desc, fn, timeout){
            var self = this;
            
            var spec = this.env[api].call(this.env, desc, function(done){   
                var isPromise;
                function next(err){
                    //Jasmine2 has no after function
                    //So after each 'it' or 'fit' we uninstall
                    //clock
                    if(self.installedMockClock){
                        jasmine.clock().uninstall();
                        self.installedMockClock = false;
                    }
                    if(fn.length != 0 || isPromise){
                        //TODO:change it with an spec.after implementation
                        self.currentSpec.finish();
                    }
                    self.currentSpec = null;
                    done(err);
                }
                next.fail = done.fail;
                self.currentSpec = new JasmineBridge.Spec(self, {}, desc, /*userContext*/this);                 
                //self != this here
                var maybeThenable = fn.call(this, next);
                if (isPromise = (maybeThenable && isFunction_(maybeThenable.then))) {
                    maybeThenable.then(next, next.fail);
                }
                if(fn.length === 0 && !isPromise){
                    self.currentSpec.execute(next);
                }
                
                
            }, timeout);
            return spec;            
        };
        this.processEach = function(method, fn, timeout) {
            var self = this;            
            var spec = this.env[method](function(done){
                var isPromise;
                function next(err){                    
                    if(fn.length != 0 || isPromise){
                        //TODO:change it with an spec.after implementation
                        self.currentSpec.finish();
                    }
                    self.currentSpec = null;
                    done(err);
                }
                next.fail = done.fail;
                self.currentSpec = new JasmineBridge.Spec(self, {}, 
                    "//TODO: get description of Suite in " + method, /*userContext*/ this);                 
                //self != this here
                var maybeThenable = fn.call(this, next);
                if (isPromise = (maybeThenable && isFunction_(maybeThenable.then))) {
                    maybeThenable.then(next, next.fail);
                }
                if(fn.length === 0 && !isPromise){
                    self.currentSpec.execute(next);
                } 
            }, timeout || jasmine.DEFAULT_TIMEOUT_INTERVAL);
            return spec;           
        };
        
        this.beforeEach = function(fn, timeout) {
            return this.processEach('beforeEach', fn, timeout);
                  
        };
        this.afterEach = function(fn, timeout) {
            return this.processEach('afterEach', fn, timeout);
                 
        };

        this.it = function(desc, fn , timeout){
            callAPI.call(this, 'it', desc, fn, timeout || jasmine.DEFAULT_TIMEOUT_INTERVAL);
        };
        this.fit = function(desc, fn, timeout){
            callAPI.call(this, 'fit', desc, fn, timeout || jasmine.DEFAULT_TIMEOUT_INTERVAL);             
        };
        this.runs = function(fn){
            this.currentSpec.runs(fn);
        };

        this.waitsFor = function(){
            this.currentSpec.waitsFor.apply(this.currentSpec, arguments);
        };
        this.waits = function(){
            this.currentSpec.waits.apply(this.currentSpec, arguments);
        };
        this.installClock = function(){ 
            jasmine.clock().install();
            this.installedMockClock = true;
        };
        
    }
    function isFunction_(value){
        return Object.prototype.toString.apply(value) === '[object Function]';
    }
    function isJasmineV3(){
        return parseInt(jasmine.version.split('.')[0]) > 2 ;
    }
}
   
