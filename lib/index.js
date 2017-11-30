var path = require('path')

var createPattern = function (pattern) {
  return {pattern: pattern, included: true, served: true, watched: false}
}

var initBridge = function (files) {
    files.push(createPattern(path.join(__dirname, '/jasmine/Block.js')));
    files.push(createPattern(path.join(__dirname, '/jasmine/WaitsForBlock.js')));
    files.push(createPattern(path.join(__dirname, '/jasmine/Queue.js')));
    files.push(createPattern(path.join(__dirname, '/base.js')));
    files.push(createPattern(path.join(__dirname, '/Spec.js')));
    files.push(createPattern(path.join(__dirname, '/boot.js')));
   
}

initBridge.$inject = ['config.files']

module.exports = {
  'framework:jasmine-bridge': ['factory', initBridge]
}