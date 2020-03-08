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
for (let [key, val] of map.entries()) {
	console.log('map entry broken', key, val)
}
```

### out

```js
var _arrayified = map.entries();
if (!Array.isArray(_arrayified)) {
  _arrayified = Array.from(_arrayified);
}
for (var _i = 0; _i < _arrayified.length; _i++) {
  var _arrayified$_i = _arrayified[_i];
  var key = _arrayified$_i[0];
  var val = _arrayified$_i[1];
  console.log('map entry broken', key, val);
}
```

### instead of babel's default

```js
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = map.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var _ref2 = _step.value;
    var _key = _ref2[0];
    var _val = _ref2[1];
    console.log('map entry broken', _key, _val);
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
