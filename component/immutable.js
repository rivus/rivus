'use strict';

var immutable = require('immutable');
var createComponent = require('./index');
var map = immutable.Map();

module.exports = createImmutableComponent;

function createImmutableComponent(options) {
  options = options || {};
  var transform = options.transform;
  options = map.merge(options);
  options = options.set('transform', transform ? addTransform : newTransform);
  options = options.toJS();
  options.seed = options.seed || map;

  return createComponent(options);

  function newTransform(stream) {
    return stream.map(toImmutable);
  }

  function addTransform(stream) {
    return transform(stream.map(toImmutable));
  }
}

function toImmutable(data) {
  return map.merge(data);
}
