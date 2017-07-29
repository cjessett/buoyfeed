export default () => {
  let _localStorage = typeof localStorage === 'undefined' ? {} : localStorage

  return {
    localStorage: {
      getItem(key) {
        return _localStorage[key] || null
      },
      removeItem(key) {
        delete _localStorage[key]
      },
      setItem(key, val) {
        _localStorage[key] = val
        return undefined
      },
    },
  }
}
