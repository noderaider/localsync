import ls from 'local-storage'
const should = require('chai').should()

let navigator = typeof window === 'object' ? window.navigator : null
function isEdgeOrIE() {
  if(!navigator)
    return false
  return navigator.appName === 'Microsoft Internet Explorer' || (navigator.appName === 'Netscape' && /(Trident|Edge)/i.test(navigator.appVersion))
}


export function cookiesync(key, action, handler, { tracing = false, logger = console, logLevel = 'info', idLength = 8, pollFrequency = 3000, path = '/', secure = false, httpOnly = false } = {}) {
  const log = (...args) => tracing ? logger[logLevel](...args) : () => {}

  const cookie = require('react-cookie')
  const cookieOpts = { path, secure, httpOnly }
  const cookieKey = `localsync_fallback_${key}`
  const instanceID = (N => (Math.random().toString(36)+'00000000000000000').slice(2, N+2))(idLength)
  const loadCookie = () => {
    try {
      const value = cookie.load(cookieKey, false)
      if(typeof value !== 'undefined') {
        const { instanceID, payload } = value
        should.exist(instanceID, `cookiesync cookies must have an instanceID associated => ${JSON.stringify(value)}`)
        instanceID.should.be.a('string').and.have.lengthOf(idLength)
        should.exist(payload, `cookiesync cookies must have a payload associated => ${JSON.stringify(value)}`)
      }
      log('cookiesync#loadCookie', value)
      return value
    } catch(err) {
      logger.error(err, `cookiesync#loadCookie => error occurred in cookiesync, wiping cookie with key ${cookieKey}`)
      cookie.remove(cookieKey)
    }
  }
  const saveCookie = (...args) => {
    args.should.be.lengthOf(1)
    const [payload] = args
    const value = { instanceID, payload }
    log('cookisync#saveCookie', instanceID, payload)
    cookie.save(cookieKey, value, cookieOpts)
  }

  let isRunning = false
  const trigger = (...args) => {
    log('cookiesync#trigger', instanceID, ...args)
    const payload = action(...args)
    log('cookiesync#trigger => payload', payload)
    saveCookie(payload)
  }

  let intervalID = null
  const start = () => {
    log('cookiesync#start', instanceID)
    let last = loadCookie()
    if(!last) {
      log('cookiesync#start: nolast', instanceID)
      last = { instanceID }
      saveCookie(last)
    }
    intervalID = setInterval(function() {
      log('cookiesync#poll', instanceID)
      let current = loadCookie()
      if(!current) {
        log('cookiesync#poll: nocurrent', instanceID)
        current = last
        saveCookie(current)
      }
      /** DONT NOTIFY IF SAME TAB */
      if(current.instanceID === instanceID) {
        log('cookiesync#poll: sameinstance', instanceID)
        return
      }

      if(JSON.stringify(last.payload) != JSON.stringify(current.payload)) {
        log('cookiesync#poll: INVOKE|instanceID =', instanceID, '|current.instanceID =', current.instanceID, '|last.instanceID =', last.instanceID, '|last.payload =', JSON.stringify(last.payload), '|current.payload =', JSON.stringify(current.payload))
        handler(current.payload)
        last = current
      } else {
        log('cookiesync#poll: noinvoke|instanceID =', instanceID, '|current.instanceID =', current.instanceID, '|last.instanceID =', last.instanceID, '|last.payload =', JSON.stringify(last.payload), '|current.payload =', JSON.stringify(current.payload))
      }
    }, pollFrequency)
    isRunning = true
  }

  const stop = () => {
    log('cookiesync#stop', instanceID)
    clearInterval(intervalID)
    isRunning = false
  }

  return  { start
          , stop
          , trigger
          , get isRunning () { return isRunning }
          , isFallback: true
          , instanceID
          }
}


export default function localsync(key, action, handler, { tracing = false, logger = console, logLevel = 'info', ...cookiesyncOpts } = {}) {
  should.exist(key)
  should.exist(action)
  should.exist(handler)
  const log = (...args) => tracing ? logger[logLevel](...args) : () => {}

  if(isEdgeOrIE()) {
    log('localsync: cookiesync fallback enabled')
    return cookiesync(key, action, handler, { tracing, logger, logLevel, ...cookiesyncOpts })
  }

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
