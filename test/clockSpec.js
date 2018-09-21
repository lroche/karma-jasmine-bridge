define([], function(){
    describe("JasmineBridge allows to support Clock Jasmine 1 APIs:", function(){
        it("jasmine.Clock should be defined", function(){
            
            expect(jasmine.Clock).toBeDefined();
        });
        describe("jasmine.Clock", function(){
            beforeEach(function() {
               
                jasmine.Clock.useMock();    
            });
            it(".useMock() should be supported", function(){
                var ticked = false;
                setTimeout(function() {
                    ticked = true;
                }, 10000);
                expect(ticked).toBe(false);
                jasmine.Clock.tick(10001);
                expect(ticked).toBe(true);
            });
            it("should be supported with Jasmine 2 done method", function(done){
                var ticked = false;
                setTimeout(function() {
                    done();
                }, 10000);
                expect(ticked).toBe(false);
                jasmine.Clock.tick(10001);
            });
            var nbExec = 0;
            it(".useMock() should be supported with Jasmine 2 done method(2)", function(){
                expect(true).toBe(true);
                nbExec++;
            });
            it(".useMock() should be supported with Jasmine 2 done method(3)", function(){
                //Just in case we verify done() method has been called once
                expect(nbExec).toBe(1);
            });

        });
        it("jasmine Clock.tick() should have needed a installed MockClock", function(){
            //This test allows to check MockClock has correctly deinstalled automaticaly
            checkClockUninstall("MockClock should be desintalled after 'it'");
        });
        it("Clock Jasmine2 should be supported", function(){
            jasmine.clock().install();
            jasmine.clock().uninstall();
        });
        describe("Clock Jasmine2", function(){
            beforeEach(function(){
                jasmine.clock().install();
            });
            it("should be supported", function(){
                var ticked = false;
                setTimeout(function() {
                    ticked = true;
                }, 10000);
                expect(ticked).toBe(false);
                jasmine.Clock.tick(10001);
                expect(ticked).toBe(true);
            });
            afterEach(function(){
                jasmine.clock().uninstall();
            });
        });
        it("Clock.useMock() should be ok in 'it' method", function(){
            jasmine.Clock.useMock();
            var ticked = false;
            setTimeout(function() {
                ticked = true;
            }, 10000);
            expect(ticked).toBe(false);
            jasmine.Clock.tick(10001);
            expect(ticked).toBe(true);
            //MockClock is desinstalled by JasmineBridge.
        });
        it("jasmine Clock.tick() should have needed a installed MockClock(2)", function(){
            checkClockUninstall("MockClock should be desintalled after 'it' (2)");
        });
        function checkClockUninstall(message){
            try {
                jasmine.Clock.tick(10000);
                fail(message);
            }catch(x){
            }
        }
    });
});