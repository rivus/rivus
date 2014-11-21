'use strict';

var immutable = require('immutable');
var mainLoop = require('main-loop');
var map = require('./map');

module.exports = createComponent;

function createComponent(options) {
  var seed = map.merge(options.seed);
  var loop = mainLoop(seed, options.template);
  var update = loop.update;

  options.stream
    .scan(seed, mergeState)
    .skipDuplicates(immutable.is)
    .doAction(updateState)
    .subscribe();

  return loop.target;

  function updateState(state) {
    update(state);
  }
}

function mergeState(previous, current) {
  return previous.merge(current);
}
