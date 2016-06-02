import ls from 'local-storage'
const should = require('chai').should()

let navigator = typeof window === 'object' ? window.navigator : null
function isEdgeOrIE() {
  if(!navigator)
    return false
  return navigator.appName === 'Microsoft Internet Explorer' || (navigator.appName === 'Netscape' && navigator.appVersion.indexOf('Trident') > -1)
}


function cookiesync(key, action, handler, { pollFrequency = 3000 } = {}) {
  const cookie = require('react-cookie')
  const cookieKey = `localsync_fb_${key}`
  const instanceID = (N => (Math.random().toString(36)+'00000000000000000').slice(2, N+2))(8)
  const loadCookie = () => cookie.load(cookieKey)
  const saveCookie = value => cookie.save(cookieKey, value)

  let isRunning = false
  const trigger = (...args) => {
    const value = action(...args)
    saveCookie(cookieKey, value)
  }


  let intervalID = null
  const start = () => {
    let last = loadCookie()
    if(!last) {
      last = { instanceID }
      saveCookie(last)
    }
    intervalID = setInterval(function() {
      let current = loadCookie()
      if(!current) {
        current = last
        saveCookie(current)
      }
      /** DONT NOTIFY IF SAME TAB */
      if(current.instanceID === instanceID)
        return

      var lastValue = last.value
      var currentValue = current.value
      if(lastValue !== currentValue)
        handler(currentValue)
      lastValue = currentValue
    }, pollFrequency)
    isRunning = true
  }

  const stop = () => {
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


export default function localsync(key, action, handler, opts = {}) {
  should.exist(key)
  should.exist(action)
  should.exist(handler)

  if(isEdgeOrIE())
    return cookiesync(key, action, handler, opts)

  let isRunning = false

  const trigger = (...args) => {
    const value = action(...args)
    ls(key, value)
  }

  const start = () => {
    ls.on(key, handler)
    isRunning = true
  }

  const stop = () => {
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
