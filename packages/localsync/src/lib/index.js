let navigator = typeof window === 'object' ? window.navigator : (() => {})()

function isEdgeOrIE() {
  if(!navigator)
    return false
  return navigator.appName === 'Microsoft Internet Explorer' || (navigator.appName === 'Netscape' && /(Trident|Edge)/i.test(navigator.appVersion))
}

export default function localsync(...args) {
  if(typeof navigator === 'undefined')
    return require('serversync').default(...args)
  return (isEdgeOrIE() ? require('cookiesync') : require('storagesync')).default(...args)
}
