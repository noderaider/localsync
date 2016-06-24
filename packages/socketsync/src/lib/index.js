const should = require('chai').should()
const mechanism = 'socketsync'

/**
 * Creates a web sockets synchronizer to synchronize events between tabs.
 * @param  {string}   key                       The key to synchronize on.
 * @param  {function} action                    The action to run when trigger is executed. Should return the payload to be transmitted to the handlers on other tabs.
 * @param  {function} handler                   The handler which is executed on other tabs when a synchronization is triggered. Argument is the return value of the action.
 * @param  {boolean}  [options.tracing=false]   Option to turn on tracing for debugging.
 * @param  {Object}   [options.logger=console]  The logger to debug to.
 * @param  {string}   [options.logLevel=info]   The log level to trace at.
 * @return {Object}                             socketsync instance with start, stop, trigger, isRunning, and isFallback mock properties.
 */
export default function socketsync(key, action, handler, { tracing = false, logger = console, logLevel = 'info' } = {}) {
  should.exist(key)
  should.exist(action)
  should.exist(handler)
  const log = (...args) => tracing ? logger[logLevel](...args) : () => {}
  let isRunning = false

  const trigger = (...args) => {
    log('socketsync#trigger', args)
    const value = action(...args)
    log('socketsync#trigger action output ignored', args, value)
  }

  const start = () => {
    log('socketsync#start')
    isRunning = true
  }

  const stop = () => {
    log('socketsync#stop')
    isRunning = false
  }

  return  { start
          , stop
          , trigger
          , get isRunning () { return isRunning }
          , mechanism
          , isFallback: false
          , isServer: false
          }
}
