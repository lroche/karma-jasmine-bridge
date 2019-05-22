define([], function(){
    describe("JasmineBridge adds support about Clock Jasmine 1 APIs:", function(){
        it("jasmine.Clock should be defined", function(){
            
            expect(jasmine.Clock).toBeDefined();
        });
        describe("jasmine.Clock", function(){
            beforeEach(function() {
               
                jasmine.Clock.useMock();    
            });
            it(".useMock() and tick() should be supported", function(){
                var ticked = false; //
                setTimeout(function() {
                    ticked = true;
                }, 1000);
                
                jasmine.Clock.tick(100);
                expect(ticked).toBe(false);
                jasmine.Clock.tick(901);
                expect(ticked).toBe(true);
            });
            it("should be supported with Jasmine 2 done method", function(done){
                var ticked = false;
                setTimeout(function() {
                    ticked = true;
                    done();
                }, 10000);
                jasmine.Clock.tick(500);
                expect(ticked).toBe(false);
                jasmine.Clock.tick(10001);
            });
            
            it("should be supported in Async Spec", function(done){
                var ticked = false;
                setTimeout(function(){
                    setTimeout(function(){
                        ticked = true;      
                    }, 100);
                    expect(ticked).toBe(false);
                    setTimeout(function(){
                        expect(ticked).toBe(true);
                        done();
                    }, 100);
                }, 100);
                
                jasmine.Clock.tick(5);
                expect(ticked).toBe(false); 
                //Launches each scheduledFunction
                jasmine.Clock.tick(1000);    
            });

        });
        it("jasmine Clock should have been uninstalled", function(){
            //This test allows to check MockClock has been correctly desinstalled automaticaly
            checkClockUninstall("MockClock should be desinstalled after 'it'");
        });
        it("Clock Jasmine2 should be installable/desinstallable in 'it'", function(){
            jasmine.clock().install();
            jasmine.clock().uninstall();
        });
        describe("Clock Jasmine2", function(){
            beforeEach(function(){
                jasmine.clock().install();
            });
            afterEach(function(){
                jasmine.clock().uninstall();
            });
            it("should be supported", function(){
                var ticked = false;
                setTimeout(function() {
                    ticked = true;
                }, 100);
                expect(ticked).toBe(false);
                jasmine.clock().tick(1);
                expect(ticked).toBe(false);
                jasmine.clock().tick(101);
                expect(ticked).toBe(true);
            });
            it("should be supported in Async Spec", function(done){
                //In fact, Spec is synchronous.
                setTimeout(function(){
                    setTimeout(function(){
                        done();
                    }, 100);
                    jasmine.clock().tick(200);
                }, 100);
                jasmine.clock().tick(150);
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
        it("jasmine Clock should have been uninstalled(2)", function(){
            checkClockUninstall("MockClock should be desinstalled after 'it' (2)");
        });
        it("Clock.useMock() should be ok in asynchronous spec and correctly uninstalled", function(done){
            var ticked = false;
            setTimeout(function(){
                jasmine.Clock.useMock();
                
                setTimeout(function() {
                    ticked = true;
                }, 10000);
                jasmine.Clock.tick(500);
                expect(ticked).toBe(false);
                jasmine.Clock.tick(10001);
                expect(ticked).toBe(true);
                done();
            }, 100)
            
            //MockClock should be desinstalled by JasmineBridge.
        });
        it("jasmine Clock should have been uninstalled(3)", function(){
            checkClockUninstall("MockClock should be desintalled after 'it' (3)");
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