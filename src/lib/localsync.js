import ls from 'local-storage'
const should = require('chai').should()

/**
 * Creates a synchronizer which uses localStorage 'storage' event for synchronization between tabs.
 * @param  {string}   key                       The key to synchronize on.
 * @param  {function} action                    The action to run when trigger is executed. Should return the payload to be transmitted to the handlers on other tabs.
 * @param  {function} handler                   The handler which is executed on other tabs when a synchronization is triggered. Argument is the return value of the action.
 * @param  {boolean}  [options.tracing=false]   Option to turn on tracing for debugging.
 * @param  {Object}   [options.logger=console]  The logger to debug to.
 * @param  {string}   [options.logLevel=info]   The log level to trace at.
 * @return {Object}                             localsync instance with start, stop, trigger, isRunning, and isFallback properties.
 */
export default function localsync(key, action, handler, { tracing = false, logger = console, logLevel = 'info' } = {}) {
  should.exist(key)
  should.exist(action)
  should.exist(handler)
  const log = (...args) => tracing ? logger[logLevel](...args) : () => {}
  let isRunning = false

  const trigger = (...args) => {
    log('localsync#trigger', args)
    const value = action(...args)
    ls(key, value)
  }

  const start = () => {
    log('localsync#start')
    ls.on(key, handler)
    isRunning = true
  }

  const stop = () => {
    log('localsync#stop')
    ls.off(key, handler)
    isRunning = false
  }

  return  { start
          , stop
          , trigger
          , get isRunning () { return isRunning }
          , isFallback: false
          }
}
