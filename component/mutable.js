'use strict';

var mainLoop = require('main-loop');
var isEqual = require('lodash-node/modern/objects/isEqual');
var merge = require('lodash-node/modern/objects/merge');

module.exports = createComponent;

function createComponent(options) {
  var seed = merge({}, options.seed);
  var loop = mainLoop(seed, options.template);
  var update = loop.update;

  options.stream
    .scan(seed, mergeState)
    .skipDuplicates(isEqual)
    .onValue(updateState);

  return loop.target;

  function updateState(state) {
    update(state);
  }
}

function mergeState(previous, current) {
  return merge({}, previous, current);
}
