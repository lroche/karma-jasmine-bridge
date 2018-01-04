module.exports = function(config){
    // Karma configuration
    
        config.set({
            // base path, that will be used to resolve files and exclude
            basePath : '.',
            
            // list of files / patterns to load in the browser
            files: [
                
                
                /* Dojo config: */
                "dojo-config.js",
                
                "node_modules/karma-dojo/dojo-adapter.js",	
                /* dojo main file */
                "node_modules/dojo/dojo.js",
            
                
            
                //AMD dojo files
                {pattern: 'node_modules/dojo/**/*.js', included:false, served:true, watched:false},
                
                //test files
                {pattern: 'test/**/*.js', included: false, served:true, watched:true},
                
                
            
            
            ],
            /* order matters : jasmine-bridge included after jasmine */
            frameworks: ['jasmine', 'jasmine-bridge'],
    
            //	Using star (*) as work-around to force resolution of pluginDirectory during inclusion
            plugins: [
            'karma-jasmin*',
            'karma-*-launcher',
            require.resolve('./')
            ],
    
            // list of files to exclude
            exclude: [
                
            ],
            // test results reporter to use
            // possible values: 'dots', 'progress', 'junit'
            reporters: ['dots', 'BrowserStack'],
    
            //junit reporter configuration
            junitReporter: 'junit',
    
            // web server port
            port: 9876,
    
            // cli runner port
            runnerPort: 9100,
    
            // enable / disable colors in the output (reporters and logs)
            colors: true,
    
            // level of logging
            // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
            logLevel: config.LOG_DEBUG,
    
            // enable / disable watching file and executing tests whenever any file changes
            autoWatch: true,
    
            // global config of your BrowserStack account
            browserStack: {
                
            },
        
            // define browsers
            customLaunchers: {
                'BS_Chrome': {
                    base: 'BrowserStack',
                    browser: 'chrome',
                    os: 'OS X',
                    os_version: 'Sierra'
                },
                'BS_Safari': {
                    base: 'BrowserStack',
                    browser: 'safari',
                    os: 'OS X',
                    os_version: 'Sierra'
                },
                'BS_Firefox': {
                    base: 'BrowserStack',
                    browser: 'firefox',
                    os: 'Windows',
                    os_version: '10'
                },
                'BS_Firefox_mac': {
                    base: 'BrowserStack',
                    browser: 'firefox',
                    os: 'OS X',
                    os_version: 'El Capitan'
                },
                'BS_IE_10': {
                    base: 'BrowserStack',
                    browser: 'ie',
                    browser_version: '10.0',
                    os: 'Windows',
                    os_version: '8'
                },
                'BS_EDGE': {
                    base: 'BrowserStack',
                    browser: 'edge',
                    os: 'Windows',
                    os_version: '10'
                }
            },

            // Start these browsers, currently available:
            // - Chrome
            // - ChromeCanary
            // - Firefox
            // - Opera
            // - Safari (only Mac)
            // - PhantomJS
            // - IE (only Windows)
            //browsers: ['Chrome', 'Firefox'],
            browsers: ['BS_Chrome', 'BS_Safari', 'BS_Firefox', 'BS_Firefox_mac', 'BS_IE_10', 'BS_EDGE' ],
            
            // If browser does not capture in given timeout [ms], kill it
            captureTimeout: 60000,
    
            // Continuous Integration mode
            // if true, it capture browsers, run tests and exit
            singleRun: false,
        });
    
    }
    