'use strict';

var mainLoop = require('main-loop');

module.exports = createComponent;

function createComponent(options) {
  var stream = options.stream;
  var seed = options.seed || {};
  var loop = mainLoop(seed, options.template);

  if(stream) {
    if(options.transform) {
      stream = options.transform(stream);
    }
    stream.subscribe(loop.update);
  }
  return loop.target;
}
