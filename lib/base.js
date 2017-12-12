
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
        //
        this.currentSpec = null;
        var callAPI = function(api, desc, fn, timeout){
            var self = this;
            
            var spec = this.env[api].call(this.env, desc, function(done){
                self.currentSpec = new JasmineBridge.Spec(self, {}, desc);                 
                //self != this here
                fn.call(this);
                
                self.currentSpec.execute(function(){
                    self.currentSpec =null;
                    done();
                });
                
            }, timeout);
            return spec;            
        };
        this.beforeEach = function(fn, timeout) {
            var self = this;            
            var spec = this.env.beforeEach(function(done){
                self.currentSpec = new JasmineBridge.Spec(self, {}, 
                    "//TODO: get description of Suite in beforeEach");                 
                //self != this here
                fn.call(this);                
                self.currentSpec.execute(function(){
                    self.currentSpec = null;
                    done();
                });
            //TODO: use DEFAULT_TIMEOUT_INTERVAL value
            }, timeout || 10000);
            return spec;           
        };
        this.it = function(desc, fn , timeout){
            callAPI.call(this, 'it', desc, fn, timeout);            
        };
        this.fit = function(desc, fn, timeout){
            callAPI.call(this, 'fit', desc, fn, timeout);             
        };
        this.runs = function(fn){
            this.currentSpec.runs(fn);
        };

        this.waitsFor = function(){
            this.currentSpec.waitsFor.apply(this.currentSpec, arguments);
        };
        this.waits = function(){
            //NIY
            throw "JasmineBridge: API waits is not yet supported";
        }
        
    }
}
   
