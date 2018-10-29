define([], function(){
    describe("API jasmine 1 of custom matchers", function(){
        beforeEach(function(){
            var customMatchers = {
                toBeCustom: function(expected) {
                    return this.actual === expected; 
                },
                toBeCustomWithMessage: function(expected) {
                    var result =  this.actual === expected;
                    this.message = function(){
                        return [
                            'Expected ' + this.actual + ' to equal ' + expected,
                            'Expected ' + this.actual + ' not to equal ' + expected
                        ];
                    }
                    return result;
                }

            }
            this.addMatchers(customMatchers);
        });
        it("should be supported", function(){
            expect(5).toBeCustom(5);
            expect(42).not.toBeCustom(0);
        });
        //TODO: find a way to get message for having a operational testcase.
        xit("should be supported with message", function(){
            expect(5).toBeCustomWithMessage(42);
            expect(42).not.toBeCustomWithMessage(42);
        })
    });
});