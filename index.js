{
  let exports = require('./trace')
  try {
    let components = require('./components')
    if (components) Object.assign(exports, components)
  } catch (err) {}
  module.exports = exports

  if (typeof window !== 'undefined') window.Trace = exports
}
