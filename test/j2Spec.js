define([
    'require'
    
], function(require, factory) {
    'use strict';
    //Goal : check if any feature of Jasmine 2 is not broken  
    describe("In jasmine2 environnement", function(){
        describe("done method", function(){
            var ok;
            it("should be supported to declare an asynchronous spec", function(done){
                expect(done).toBeDefined();
                setTimeout(function(){
                    ok = true;
                    done();
                },100);
                ok = false;
            });
            it("fail() method should be supported", function(done){
                
                expect(done.fail).toBeDefined();           
                if(!ok){
                    done.fail("done should create correcty an asynchronous spec");
                }
                done();
            })
            
        });
        describe("beforeEach/afterEach", function(){
            var isInit;
            beforeEach(function(done){
                expect(done).toBeDefined();
                setTimeout(function(){
                    isInit = true;
                    done();
                }, 100);
                isInit = false;
            });
            it("should support correctly done() method", function(){
                expect(isInit).toBe(true);
            });
        });
    })  
});