const AnimatedValue = require('./animated-value')

module.exports = class AnimatedBoolean extends AnimatedValue {
  constructor (defaultValue) {
    super(defaultValue)

    this.interpolator = AnimatedBoolean.interpolator
  }

  static interpolator (currentTime, keys, defaultValue) {
    // find closest keys before and after currentTime
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
    // return the right key's value if there are none on the left
    if (!Number.isFinite(closestLeft)) {
      return AnimatedValue.resolveKey(keys, closestRight, defaultValue)[0]
    }
    // return the left key's value
    return AnimatedValue.resolveKey(keys, closestLeft, defaultValue)[0]
  }
}
