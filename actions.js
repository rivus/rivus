'use strict';

var bacon = require('baconjs');
var getobject = require('getobject');
var isArray = require('lodash-node/modern/objects/isArray');
var isPlainObject = require('lodash-node/modern/objects/isPlainObject');
var list = require('./list');
var map = require('./map');

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
    data = list.concat(data);
  }
  else if(isPlainObject(data)) {
    data = map.merge(data);
  }

  return data;
}
