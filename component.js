'use strict';

var mainLoop = require('main-loop');

module.exports = createComponent;

function createComponent(options) {
  var stream = options.stream;
  var seed = options.seed || {};
  var loop = mainLoop(seed, options.template);
  var unsubscribed = false;

  if(stream) {
    if(options.transform) {
      stream = options.transform(stream);
    }
    stream.onValue(loop.update);

    return {
      component: loop.target,
      unsubscribe: unsubscribe
    };
  }

  return {component: loop.target};

  function unsubscribe() {
    if(!unsubscribed) {
      stream.offValue(loop.update);
      unsubscribed = true;
    }
  }
}
