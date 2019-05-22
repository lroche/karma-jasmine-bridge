define([
    'require'
    
], function(require, factory) {
    'use strict';
    //Goal : check if any feature of Jasmine 2 is not broken  
    describe("In jasmine2 environnement", function(){
        describe("done method", function(){
            it("should be supported to declare an asynchronous spec", function(done){ 
                expect(done).toBeDefined();
                setTimeout(function(){
                    done();
                },100);
            });
            it("fail() method should be supported", function(done){
                expect(done.fail).toBeDefined();           
                done();
            })
            
        });
        describe('version() is available', function(){
            it('jasmineRequire.version() should return something', function(){
                expect(parseInt(jasmine.version.split('.')[0])).toBe(3);
            });
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
        if(hasPromise()){
            describe("beforeEach/AfterEach should support Promise", function(){
                function newPromise(){
                    return new Promise(function(resolve){
                        setTimeout(resolve, 1);
                    });
                };
                var promiseOk;
                beforeEach(function(){
                    this.runsCalled = false;
                    runs(function(){
                        this.runsCalled = true;//should not happens
                    });
                    return newPromise().then(function(){
                        promiseOk = true;
                    });
                });
                afterEach(function(){
                    return newPromise();
                })
                it("and 'it' function", function(){
                    //runs API is not supported when Spec is promise-like
                    expect(this.runsCalled).toBe(false);
                    return newPromise();
                });
                it(" and 'it' should support still runs/waitsFor", function(){
                    var isOk;
                    runs(function(){
                        newPromise().then(function(){
                            isOk = true;
                        }); 
                    });
                    waitsFor(function(){
                        return isOk === true;
                    }, "not ok", 100);
                    runs(function(){
                        expect(promiseOk).toBe(true);
                    });
                });
            });
        }
        function hasPromise() {
            return typeof Promise !== 'undefined';
        }
    })  
});