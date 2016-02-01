# console-prefix [![Build Status](https://img.shields.io/travis/alanshaw/console-prefix.svg?style=flat-square)](https://travis-ci.org/alanshaw/console-prefix) [![Dependency Status](https://david-dm.org/alanshaw/console-prefix.svg?style=flat-square)](https://david-dm.org/alanshaw/console-prefix)

Drop in replacement for console to add a prefix to messages. Adds an ISO timestamp by default.

## Example

```js
var console = require('console-prefix')

console.log('Hello!')
// Output:
// 2015-04-29T22:46:37.444Z Hello!
```

### Customise prefix

```js
var console = require('console-prefix')('[Sprocket]')

function Sprocket () {
  console.log('in constructor')
}

new Sprocket()
// Output:
// [Sprocket] in constructor
```

```js
var console = require('console-prefix')(function () {
  return new Date() + ' --'
})

console.log('Hello World!')
// Output:
// Wed Apr 29 2015 19:56:24 GMT-0300 (CLT) -- Hello World!
```

## Options

Configure the proxy object returned by passing an options object:

```js
var console = require('console-prefix')({
  prefix: function () { return new Date().toISOString() },
  methods: ['log', 'info', 'warn', 'error'],
  console: global.console
})
```

### prefix

A `string` or `function` to prefix log messages with. Defaults to an ISO timestamp.

### methods

The logging methods the prefix should be applied to. Defaults to 'log', 'info', 'warn', 'error'.

### console

The logger object to proxy to. Defaults to `global.console` or `window.console` (depending on the environment).
