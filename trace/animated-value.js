const EventEmitter = require('events')

class AnimatedValue extends EventEmitter {
  constructor (defaultValue) {
    super()

    this.defaultValue = defaultValue
    this.keys = new Map()
    this.interpolator = AnimatedValue.interpolator
    this.interpolatorSettings = {}
    this.lastValue = null
  }

  getValue (currentTime, deltaTime) {
    let value = AnimatedValue.applyInterpolator(this, currentTime, deltaTime)

    // emit `change` if the value changed
    if (this.valuesAreEqual(value, this.lastValue)) {
      this.lastValue = value
      this.emit('change', currentTime, deltaTime, value)
    }

    return value
  }

  valuesAreEqual (a, b) {
    return a === b
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

  static interpolator ({ currentTime, keys, defaultValue, deltaTime, settings }) {
    // find closest keys before and after current time
    let closestLeft = -Infinity
    let closestRight = Infinity

    for (let time of keys.keys()) {
      if (time <= currentTime && time > closestLeft) closestLeft = time
      if (time > currentTime && time < closestRight) closestRight = time
    }

    // return default value if no keys are available
    if (!Number.isFinite(closestLeft) && !Number.isFinite(closestRight)) {
      return defaultValue
    }

    // return right key's value if there are none on the left
    if (!Number.isFinite(closestLeft)) {
      return AnimatedValue.resolveKey(keys, closestRight, defaultValue)[0]
    }
    // return the left key's value
    return AnimatedValue.resolveKey(keys, closestLeft, defaultValue)[0]
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
      if (!key) {
        return [
          defaultValue,
          {
            function: undefined,
            parameters: undefined
          }
        ]
      }
      return key
    } else return keys.get(time)
  }

  static applyInterpolator (instance, currentTime, deltaTime) {
    return instance.interpolator({
      currentTime,
      keys: instance.keys,
      defaultValue: instance.defaultValue,
      deltaTime,
      settings: instance.interpolatorSettings
    })
  }
}
AnimatedValue.PREV_KEY = Symbol('Previous Key')
module.exports = AnimatedValue
