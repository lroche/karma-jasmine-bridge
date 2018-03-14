define([
    'require'
    
], function(require, factory) {
    'use strict';
    //Goal : check if any feature of Jasmine 2 is not broken  
    describe("In jasmine2 environnement", function(){
        it("it supports async callback with done function", function(done){
            expect(done).toBeDefined();
        });
        it("fail() method should be support", function(done){
            expect(done.fail).toBeDefined();           
            
        })
    })  
});