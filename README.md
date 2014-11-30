# Rivus
[![NPM](http://img.shields.io/npm/v/rivus.svg?style=flat-square)](https://www.npmjs.org/package/rivus)
![License](http://img.shields.io/npm/l/rivus.svg?style=flat-square)
[![Dependencies](http://img.shields.io/david/rivus/rivus.svg?style=flat-square)](https://david-dm.org/rivus/rivus)

Rivus is a collection of utilities to help provide an implementation of the
[Flux architecture](http://facebook.github.io/flux/docs/overview.html) driven
by [FRP](http://en.wikipedia.org/wiki/Functional_reactive_programming) using
[Bacon.js](http://baconjs.github.io/).
[Immutable](http://facebook.github.io/immutable-js/) is optionally available so
data that is dispatched and/or sent to a component is immutable.

## Modules

### `actions([action1, action2, ...])`
This is a function that will compose an object that is used to dispatch actions
as well as respond to actions given. Each action should be a string of plain
text. Namespaces can be included using `.`. Avoid overlapping action names like
`packages.recent` and `packages.recent.set`.

#### Example

```js
var createActions = require('rivus/mutable/actions');

module.exports = createActions([
  'user.login',
  'user.logout',
  'packages.set',
  'packages.refresh'
]);
```

Will provide you with the the following given that:

```js
var actions = require('./actions');
```

This is one of several Bacon.js streams that includes data that may have been
passed along from a dispatch call:

```js
actions.packages.refresh
```

From this you can start transforming and manipulating the stream, which can be
handed off (ex: stores) or subscribe: (ex: components)

```js
actions.packages.set
  .filter(function(x) { return x.token === token; })
  .map(function(x) { return x.id; })
  .skipDuplicates();
```

This is how you can dispatch an action:

```js
actions.user.logout.dispatch();
```

You can also pass in data as an argument to the stream:

```js
actions.user.login.dispatch({username: username, password: password});
```

If you use `require('rivus/immutable/actions')`, data that is dispatched along
is made immutable with Immutable's `fromJS`.


### `component(options)`
This is a function that will return a DOM structure using a
[virtual DOM](https://github.com/Raynos/virtual-hyperscript) template and a
Bacon stream. The following options can be provided:

#### Options

##### `options.template`
A required function that renders a virtual DOM tree. It can be passed in an
argument that is an argument from stream/seed below.

##### `options.stream`
An optional Bacon stream that should currently have an object or Immutable map.
You can take advantage of Bacon's `combine`, `combineTemplate` to combine
multiple streams. When a stream emits an update, it will be used to render a
template update.

##### `options.seed`
An optional object or Immutable map that is used for the initial render of the
template. If not provided, an empty object or Immutable map is used to
initialize.

#### Example

```js
var bacon = require('rivus/lib/bacon');
var createComponent = require('rivus/mutable/component');
var h = require('virtual-hyperscript');
var taskStore = require('../stores/task');
var userStore = require('../stores/user');

var stream = bacon.combineTemplate({
  user: userStore,
  task: taskStore
});

module.exports = createComponent({
  template: template,
  stream: stream,
  seed: {user: {}, task: {}}
});

function template(options) {
  return h('div.card', [
    h('h1', options.user.name),
    h('p.name', options.task.id)
  ]);
}
```

Can be used like so:

```js
var actions = require('./actions');
var component = require('./components/task');

document.body.appendChild(component);

// ...

actions.task.get.dispatch({id: 4});
```

If you use `require('rivus/immutable/component')` the data that is passed to
the template function is converted to an Immutable map.

## Dependencies/Extras

### Bacon.js
The same Bacon.js library that is used here is available as
`require('rivus/lib/bacon')`. If you want to override/lock the version and use
`require('bacon.js')` without worring about two versions, consider using
`npm dedupe`.

### Immutable.js
The same Immutable.js library that is used here is available as
`require('rivus/lib/immutable')`. If you want to override/lock the version and
use `require('immutable')` without worring about two versions, consider using
`npm dedupe`.

### List
An empty Immutable list is available as `require('rivus/immutable/list')`. This
can be used to conveniently compose lists with `.merge`.

### Map
An empty Immutable map is available as `require('rivus/immutable/map')`. This
can be used to conveniently compose maps with `.merge`.
