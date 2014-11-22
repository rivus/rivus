'use strict';

var bacon = require('baconjs');
var getobject = require('getobject');
var immutable = require('immutable');

module.exports = createActions;

function createActions(actionList, options) {
  options = options || {};
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
  return immutable.fromJS(message.data);
}
