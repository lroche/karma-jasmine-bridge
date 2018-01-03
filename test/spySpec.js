define([], function(){
    describe("JasmineBridge allows to support almost all Spy legacy APIs:", function(){
        
        it("andCallThrough() should be supported", function(){
            var foo = {
                not: function(bool) { return !bool; }
            }
            
            spyOn(foo, 'not').andCallThrough();
            
            foo.not(42 == 42);
      
            expect(foo.not).toHaveBeenCalledWith(true);
            
        });
        it("andCallFake() should be supported", function(){
            var spy = jasmine.createSpy('spy');
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

        //TODO: features not supported.
        /*xit("spy.callCount property should be supported", function(){
            var spy = jasmine.createSpy('spy');
            spy.andReturn(1);
            spy();
            expect(spy.callCount).toBe(1);
        });
        xit("spy.mostRecentCall.args should be suppported", function(){
            var spy = jasmine.createSpy('spy');
            spy('foobar')
            expect(spy.mostRecentCall.args).toEqual(['foobar']);
        });
        xit("spy.calls could be maybe supported", function(){});
        xit("spy.argsForCall could be maybe supported", function(){});
        */

    })
})