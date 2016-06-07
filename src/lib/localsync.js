import ls from 'local-storage'
const should = require('chai').should()

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
