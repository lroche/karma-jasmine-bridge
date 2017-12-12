
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
                fn.call(this);
                self.currentSpec.execute(function(){
                    self.currentSpec =null;
                    done();
                });
                
            }, timeout);
            return spec;            
        };
        this.beforeEach = function(fn) {
            this.currentSpec = new JasmineBridge.Spec(this, {}, "//TODO: get description of Suite in beforeEach");
            //TODO: get real DEFAULT_TIMEOUT_INTERVAL value for beforeEach
            this.env.beforeEach(fn, timeout || 10000);           
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
   
