'use strict';

var bacon = require('baconjs');
var getobject = require('getobject');

module.exports = createActions;

function createActions(actionList, options) {
  options = options || {};
  var emitter = new bacon.Bus();
  var actions = {};
  var plucker = options.immutable ? makeGetDataAsImmutable() : getData;

  actionList.reduce(addAction, {
    emitter: emitter,
    actions: actions,
    plucker: plucker
  });

  return actions;
}

function addAction(options, action) {
  var emitter = options.emitter;
  var stream = emitter
    .filter(verifyAction)
    .map(options.plucker);

  stream.dispatch = function(data) {
    emitter.push({action: action, data: data});
  };
  getobject.set(options.actions, action, stream);

  return options;

  function verifyAction(message) {
    return message.action === action;
  }
}

function getData(message) {
  return message.data;
}

function makeGetDataAsImmutable() {
  var isArray = require('lodash-node/modern/objects/isArray');
  var isPlainObject = require('lodash-node/modern/objects/isPlainObject');
  var list = require('./list');
  var map = require('./map');

  return function() {
    var data = message.data;

    if(isArray(data)) {
      return list.merge(data);
    }
    else if(isPlainObject(data)) {
      return map.merge(data);
    }
    else {
      return data;
    }
  };
}
