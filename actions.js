'use strict';

var kefir = require('kefir');
var getobject = require('getobject');
var immutable = require('immutable');
var isArray = require('lodash-node/modern/objects/isArray');
var isPlainObject = require('lodash-node/modern/objects/isPlainObject');

module.exports = createActions;

function createActions(actionList) {
  var emitter = kefir.emitter();
  var actions = {};

  actionList.reduce(addAction, {emitter: emitter, actions: actions});

  return actions;
}

function addAction(options, action) {
  var emitter = options.emitter;
  var stream = emitter.filter(verifyAction).map(getData);

  stream.dispatch = function(data) {
    emitter.emit({action: action, data: data});
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
    data = immutable.List(data);
  }
  else if(isPlainObject(data)) {
    data = immutable.Map(data);
  }

  return data;
}
