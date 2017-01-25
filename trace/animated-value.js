let defaultInterpolator = function (_1, _2, defaultValue) { return defaultValue }

class AnimatedValue {
  constructor (defaultValue) {
    this.defaultValue = defaultValue
    this.keys = new Map()
    this.interpolator = defaultInterpolator
    this.interpolatorSettings = {}
  }

  getValue (currentTime, deltaTime) {
    return AnimatedValue.applyInterpolator(this, currentTime, deltaTime)
  }

  addKey (time, value, easing, parameters) {
    this.keys.set(time, [value, {
      function: easing,
      parameters: parameters
    }])
  }
  removeKey (time) {
    this.keys.delete(time)
  }

  static resolveKey (keys, time, defaultValue) {
    if (keys.get(time) && keys.get(time)[0] === AnimatedValue.PREV_KEY) {
      let keyTime = -Infinity
      let key
      for (let t of keys.keys()) {
        if (t < time && t > keyTime) {
          keyTime = t
          key = keys.get(t)
        }
      }
      if (!key) return defaultValue
      return key
    } else return keys.get(time)
  }

  static applyInterpolator (instance, currentTime, deltaTime) {
    return instance.interpolator(currentTime, instance.keys,
      instance.defaultValue, deltaTime, instance.interpolatorSettings)
  }
}
AnimatedValue.PREV_KEY = Symbol('Previous Key')
module.exports = AnimatedValue
