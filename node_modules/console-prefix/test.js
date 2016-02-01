var test = require('tape')
var cp = require('./')

function spyOnConsole (method, spy) {
  console['_' + method] = console[method]
  console[method] = function () {
    console['_' + method].apply(console, arguments)
    spy.apply(console, arguments)
  }
}

function spyOffConsole (method) {
  console[method] = console['_' + method]
}

test('Adds ISO timestamp to console messages by default', function (t) {
  t.plan(2)

  var console = cp
  var msg = 'foo'
  var now = new Date().toISOString()

  spyOnConsole('log', function () {
    spyOffConsole('log')
    t.equal(arguments[0].split('T')[0], now.split('T')[0], 'Timestamp was first arg')
    t.equal(arguments[1], msg, 'Message was second arg')
    t.end()
  })

  console.log(msg)
})

test('Proxies to log, info warn and error console methods', function (t) {
  t.plan(8)

  var console = cp
  var now = new Date().toISOString()

  spyOnConsole('log', function () {
    spyOffConsole('log')
    t.equal(arguments[0].split('T')[0], now.split('T')[0], 'Timestamp was first arg')
    t.equal(arguments[1], 'log', 'Message was second arg')
  })

  spyOnConsole('info', function () {
    spyOffConsole('info')
    t.equal(arguments[0].split('T')[0], now.split('T')[0], 'Timestamp was first arg')
    t.equal(arguments[1], 'info', 'Message was second arg')
  })

  spyOnConsole('warn', function () {
    spyOffConsole('warn')
    t.equal(arguments[0].split('T')[0], now.split('T')[0], 'Timestamp was first arg')
    t.equal(arguments[1], 'warn', 'Message was second arg')
  })

  spyOnConsole('error', function () {
    spyOffConsole('error')
    t.equal(arguments[0].split('T')[0], now.split('T')[0], 'Timestamp was first arg')
    t.equal(arguments[1], 'error', 'Message was second arg')
    t.end()
  })

  console.log('log')
  console.info('info')
  console.warn('warn')
  console.error('error')
})

test('Customise prefix with string', function (t) {
  t.plan(2)

  var prefix = '[PREFIX]'
  var console = cp(prefix)
  var msg = 'foo'

  spyOnConsole('log', function () {
    spyOffConsole('log')
    t.equal(arguments[0], prefix, 'Prefix was first arg')
    t.equal(arguments[1], msg, 'Message was second arg')
    t.end()
  })

  console.log(msg)
})

test('Customise prefix with function', function (t) {
  t.plan(2)

  var prefix = function () { return '[PREFIX]' }
  var console = cp(prefix)
  var msg = 'foo'

  spyOnConsole('log', function () {
    spyOffConsole('log')
    t.equal(arguments[0], prefix(), 'Prefix return value was first arg')
    t.equal(arguments[1], msg, 'Message was second arg')
    t.end()
  })

  console.log(msg)
})
