define([], function(){
    describe("JasmineBridge allows to support", function(){
        it("runs and waitsFor API", function(){
            var done;
            runs(function(){
                setTimeout(function(){
                 done = true;   
                }, 1);
            });
            waitsFor(function(){
                return done === true;
            }, "not ok", 100);
        });
        it("waits and runs", function(){
            var done;
            runs(function(){
                setTimeout(function(){
                 done = true;   
                }, 1);
            });
            waits(100);
            expect(done).toBeUndefined();
            runs(function(){
                expect(done).toBe(true);
            })
        });

        it("one userContext correctly in Spec", function(){
            this.value = 0;
            runs(function(){
                var self = this;
                setTimeout(function(){
                 self.value++;   
                }, 1);
            });
            waitsFor(function(){
                return this.value === 1;
            }, "not ok", 100);
        })
    })
})