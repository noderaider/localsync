import ls from 'local-storage'
const should = require('chai').should()

let navigator = typeof window === 'object' ? window.navigator : null
function isEdgeOrIE() {
  if(!navigator)
    return false
  return navigator.appName === 'Microsoft Internet Explorer' || (navigator.appName === 'Netscape' && navigator.appVersion.indexOf('Trident') > -1)
}

const createInstanceID = (N = 8) => (Math.random().toString(36)+'00000000000000000').slice(2, N+2)

const createCookieKey = key => `localsync_fb_${key}`


function cookiesync(key, sync, handler, { pollFrequency = 3000 } = {}) {
  const cookie = require('react-cookie')
  const cookieKey = createCookieKey(key)
  const instanceID = createInstanceID()
  let isSyncRunning = false

  const loadCookie = () => cookie.load(cookieKey)
  const saveCookie = value => cookie.save(cookieKey, value)



  const triggerSync = (...args) => {
    const value = sync(...args)
    saveCookie(cookieKey, value)
  }


  let intervalID = null
  const startSync = () => {
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
    isSyncRunning = true
  }

  const stopSync = () => {
    clearInterval(intervalID)
    isSyncRunning = false
  }

  return  { startSync
          , stopSync
          , triggerSync
          , get isSyncRunning () { return isSyncRunning }
          , isFallback: true
          , instanceID
          }
}


export default function localsync(key, sync, handler, opts = {}) {
  should.exist(key)
  should.exist(sync)
  should.exist(handler)

  if(isEdgeOrIE())
    return cookiesync(key, sync, handler, opts)

  let isSyncRunning = false

  const triggerSync = (...args) => {
    const value = sync(...args)
    ls(key, value)
  }

  const startSync = () => {
    ls.on(key, handler)
    isSyncRunning = true
  }

  const stopSync = () => {
    ls.off(key, handler)
    isSyncRunning = false
  }

  return  { startSync
          , stopSync
          , triggerSync
          , get isSyncRunning () { return isSyncRunning }
          , isFallback: false
          }
}
