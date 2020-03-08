# babel-plugin-transform-for-of-without-iterator

## Why?

By default, Babel transpiles for-or syntax to use `Symbol.iterator`. Pretty ironic from a tool that's supposed to make your code backwards compatible. And now you have to import ~100kB `Symbol` polyfill.

Well not anymore.

## Installation

```
npm install babel-plugin-transform-for-of-without-iterator --save-dev
```

and add it to the plugin list

```
{
  "plugins": ["babel-plugin-transform-for-of-without-iterator"]
}
```

## What it does

Wraps the right side of the "of" into `Array.from` 

Supports:
* arrays and array-like (`NodeList`)
* `Set`
* `Map`
* `map.entries()` and friends

### in

```js
for (let [key, val] of map) {
	console.log('map entry', key, val)
}
```

### out

```js
var _arrayified = map;
if (!Array.isArray(_arrayified)) {
  if (typeof map.entries === 'function') _arrayified = _arrayified.entries();
  _arrayified = Array.from(_arrayified);
}
for (var _i = 0; _i < _arrayified.length; _i++) {
  var _ref = _arrayified[_i];
  var _key = _ref[0];
  var _val = _ref[1];
  console.log('map entry', _key, _val);
}
```

### instead of babel's default

```js
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = map.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var _ref = _step.value;
    var _key = _ref[0];
    var _val = _ref[1];
    console.log('map entry', _key, _val);
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return != null) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}
```
