var xtend = require('xtend/mutable')
var METHODS = ['log', 'info', 'warn', 'error']

function isoTimestamp () {
  return new Date().toISOString()
}

function createProxy (opts) {
  opts = opts || {}

  if (typeof opts == 'function' || typeof opts == 'string')
    opts = {prefix: opts}

  var prefix = opts.prefix || isoTimestamp

  if (typeof prefix != 'function')
    prefix = function () { return opts.prefix }

  var methods = opts.methods || METHODS
  var logger = opts.console || console

  return Object.keys(logger).reduce(function (proxy, method) {
    if (methods.indexOf(method) > -1) {
      proxy[method] = function () {
        var args = [].slice.call(arguments)
        args.unshift(prefix())
        logger[method].apply(logger, args)
      }
    } else {
      proxy[method] = logger[method]
    }

    return proxy
  }, {})
}

module.exports = xtend(createProxy, createProxy())
