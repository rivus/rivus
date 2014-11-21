'use strict';

var bacon = require('baconjs');
var getobject = require('getobject');
var immutable = require('immutable');
var isArray = require('lodash-node/modern/objects/isArray');
var isPlainObject = require('lodash-node/modern/objects/isPlainObject');
var emptyList = immutable.List();
var emptyMap = immutable.Map();

module.exports = createActions;

function createActions(actionList) {
  var emitter = new bacon.Bus();
  var actions = {};
  actionList.reduce(addAction, {emitter: emitter, actions: actions});
  return actions;
}

function addAction(options, action) {
  var emitter = options.emitter;
  var stream = emitter.filter(verifyAction).map(getData);

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
  var data = message.data;

  if(isArray(data)) {
    data = emptyList.merge(data);
  }
  else if(isPlainObject(data)) {
    data = emptyMap.merge(data);
  }

  return data;
}
