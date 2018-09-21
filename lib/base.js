
var JasmineBridge = function(){
    var currentEnv;
    this.getEnv = function(){
        currentEnv = currentEnv || new Env(jasmine.getEnv());
        return currentEnv;
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
                self.currentSpec = new JasmineBridge.Spec(self, {}, desc, /*userContext*/this);                 
                //self != this here
                fn.call(this, done);
                
                self.currentSpec.execute(function onComplete(){
                    //Jasmine2 has no after function
                    //So after each 'it' or 'fit' we uninstall
                    //clock
                    if(self.installedMockClock){
                        jasmine.clock().uninstall();
                        self.installedMockClock = false;
                    }
                    self.currentSpec =null;
                    //done() can be called twice or more, it will be always execute only once
                    //so if the done method is used into asynchronous spec, this
                    //following call will do nothing, if not, it will be the good one.
                    done();
                });
                
            }, timeout);
            return spec;            
        };
        //TODO: factorize beforeEach and afterEach methods
        this.beforeEach = function(fn, timeout) {
            var self = this;            
            var spec = this.env.beforeEach(function(done){
                self.currentSpec = new JasmineBridge.Spec(self, {}, 
                    "//TODO: get description of Suite in beforeEach", /*userContext*/ this);                 
                //self != this here
                fn.call(this, done);                
                self.currentSpec.execute(function(){
                    self.currentSpec = null;
                    done();
                });            
            }, timeout || jasmine.DEFAULT_TIMEOUT_INTERVAL);
            return spec;           
        };
        this.afterEach = function(fn, timeout) {
            var self = this;            
            var spec = this.env.afterEach(function(done){
                self.currentSpec = new JasmineBridge.Spec(self, {}, 
                    "//TODO: get description of Suite in beforeEach", /*userContext*/ this);                 
                //self != this here
                fn.call(this, done);                
                self.currentSpec.execute(function(){
                    self.currentSpec = null;
                    done();
                });            
            }, timeout || jasmine.DEFAULT_TIMEOUT_INTERVAL);
            return spec;           
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
}
   
