import loadScript from './loadScript'

export default (callback) => {
  if (
    'Promise' in window &&
    'assign' in Object
  ) {
    callback()
  } else {
    loadScript('//cdn.polyfill.io/v2/polyfill.min.js?features=Object.assign,Promise', callback)
  }
}
