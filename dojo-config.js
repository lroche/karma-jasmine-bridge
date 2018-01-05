//This file is needed only by tests
//Dojo Configuration  :
var dojoConfig = {
    async:true, //All your sources MUST be AMD compliant !
    
	baseUrl: "/base/src",
    
    cacheBust:new Date(),
    packages:[
        //TODO(lroche): dojo modules are not used here just AMD Loader.
        /*{name:"dojo", location:"/base/deps/dojo"}*/
    ],
    //updated by karma-dojo-adapter:
    deps: null, 
    waitSeconds:30, 
    //custom objects for test purposes
    appConfig:{ 
    	foo:'bar',
        car:'cdr',
        welcomeMessage: "Hello World !"
    },
    has:{    	
        "dojo-undef-api":1
    },
    //Dojo Trace API 
    //for debugging :
    trace:{
    	"loader-run-factory":0,
    	"loader-define":0
    },
    callback:null, 
    loaderPatch: {
        //As of dojo 1.11, 'undef' behaviour has changed, we set the legacy behaviour here.
        //TODO: integrate new one.
        undef: function(moduleId, referenceModule){
			// In order to reload a module, it must be undefined (this routine) and then re-requested.
			// This is useful for testing frameworks (at least).
			delete require.modules[moduleId];
			
		}
    },
    locale:"en"
}