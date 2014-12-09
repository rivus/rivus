'use strict';

var mainLoop = require('main-loop');

module.exports = createComponent;

function createComponent(options) {
  var stream = options.stream;
  var seed = options.seed || {};
  var loop = mainLoop(seed, options.template);
  var update = loop.update;

  if(stream) {
    if(options.transform) {
      stream = options.transform(stream);
    }

    var unsubscribe = stream.onValue(update);

    return {
      component: loop.target,
      unsubscribe: unsubscribe
    };
  }
  else {
    return {component: loop.target};
  }
}
