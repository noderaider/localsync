let navigator = typeof window === 'object' ? window.navigator : null
function isEdgeOrIE() {
  if(!navigator)
    return false
  return navigator.appName === 'Microsoft Internet Explorer' || (navigator.appName === 'Netscape' && /(Trident|Edge)/i.test(navigator.appVersion))
}
export default (...args) => (isEdgeOrIE() ? require('./cookiesync') : require('./localsync')).default(...args)
