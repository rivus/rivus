'use strict';

var kefir = require('kefir');
var getobject = require('getobject');

module.exports = createActions;

function createActions(actionList, options) {
  var emitter = kefir.emitter();
  var actions = {};

  actionList.reduce(addAction, {
    emitter: emitter,
    actions: actions,
    transform: options && options.transform
  });

  return actions;
}

function addAction(options, action) {
  var emitter = options.emitter;
  var stream = emitter.filter(verifyAction).map(getData);

  if(options.transform) {
    stream = options.transform(stream);
  }
  stream.dispatch = dispatch;
  getobject.set(options.actions, action, stream);

  return options;

  function dispatch(data) {
    emitter.emit({action: action, data: data});
  }

  function verifyAction(message) {
    return message.action === action;
  }
}

function getData(message) {
  return message.data;
}
