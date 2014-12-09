'use strict';

var immutable = require('immutable');
var createActions = require('./index');
var immutableFromJS = immutable.fromJS;
var map = immutable.Map();

module.exports = function(actionList, options) {
  options = options || {};
  var transform = options.transform;
  options = map.merge(options);
  options = options.set('transform', transform ? addTransform : newTransform);
  options = options.toJS();

  return createActions(actionList, options);

  function newTransform(stream) {
    return stream.map(immutableFromJS);
  }

  function addTransform(stream) {
    return transform(stream.map(immutableFromJS));
  }
};
