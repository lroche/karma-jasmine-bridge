define([], function(){
    describe("JasmineBridge allows to support all Spy legacy APIs:", function(){
        
        it("andCallThrough() should be supported", function(){
            var foo = {
                not: function(bool) { return !bool; }
            }
            
            spyOn(foo, 'not').andCallThrough();
            
            foo.not(42 == 42);
      
            expect(foo.not).toHaveBeenCalledWith(true);
            
        });
        it("andCallFake() should be supported", function(){
            var spy = jasmine.createSpy('spy'),
                fn =function(value){ return value;};
            spy.andCallFake(fn);
            spy('foo');
            expect(spy).toHaveBeenCalledWith('foo');
        });

        it("andThrow() should be supported", function(){
            var spy = jasmine.createSpy('spy'),
                erratum = { 
                    boum: function(){
                        return false;
                    }
                }
            spyOn(erratum, 'boum').andThrow("badaboum !");    
            try{
                erratum.boum();
                expect("A error should be thrown").toBe("A error should be thrown");
            }catch(x){
                       
            }
        });
        it("andReturn() should be supported", function(){
            var spy = jasmine.createSpy('spy');
            spy.andReturn(1);
            expect(spy()).toBe(1);
        });
        it("spy.reset() method should be supported", function(){
            var spy = jasmine.createSpy('spy');
            spy('foobar')
            expect(spy.callCount).toBe(1);
            spy.reset();
            expect(spy.callCount).toBe(0);
        });        
        it("spy.callCount property should be supported", function(){
            var spy = jasmine.createSpy('spy');
            spy.andReturn(1);
            spy();
            expect(spy.callCount).toBe(1);
        });
        it("spy.mostRecentCall.args should be suppported", function(){
            var spy = jasmine.createSpy('spy');
            spy('foobar')
            expect(spy.mostRecentCall.args).toEqual(['foobar']);
        });
        it("spy.calls[index].args should be supported", function(){
            var spy = jasmine.createSpy('spy');
            spy('foo');
            spy('bar');
            expect(spy.calls[0].args).toBeDefined();
            expect(spy.calls[1].args).toBeDefined();
            expect(spy.calls[0].args).toEqual(/*jasmine 2 api:*/spy.calls.argsFor(0));
            expect(spy.calls[5].args).toEqual(/*jasmine 2 api:*/spy.calls.argsFor(5));
        });
        it("spy.calls.length should be supported", function(){
            var spy = jasmine.createSpy('spy');
            spy('foobar');
            expect(spy.calls.length).toBe(1);
        });
        it("spy.argsForCall should be supported", function(){
            var spy = jasmine.createSpy('spy');
            spy('foo');
            spy('bar');
            expect(spy.argsForCall[0]).toBeDefined();
            expect(spy.argsForCall[0][0]).toEqual('foo');
            expect(spy.argsForCall[1][0]).toEqual('bar');
        });
        
       
    })
})