var path = require('path')

var createPattern = function (pattern) {
  return {pattern: pattern, included: true, served: true, watched: false}
}

var initBridge = function (files) {

    files.unshift(createPattern(path.join(__dirname, '/boot.js')));
    files.unshift(createPattern(path.join(__dirname, '/Spec.js')));
    files.unshift(createPattern(path.join(__dirname, '/base.js')));
    files.unshift(createPattern(path.join(__dirname, '/jasmine/Queue.js')));
    files.unshift(createPattern(path.join(__dirname, '/jasmine/WaitsBlock.js')));
    files.unshift(createPattern(path.join(__dirname, '/jasmine/WaitsForBlock.js')));
    files.unshift(createPattern(path.join(__dirname, '/jasmine/Block.js')));
    
    
   
}

initBridge.$inject = ['config.files']

module.exports = {
  'framework:jasmine-bridge': ['factory', initBridge]
}