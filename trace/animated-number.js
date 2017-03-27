const AnimatedValue = require('./animated-value')
const Easing = require('./easing')

module.exports = class AnimatedNumber extends AnimatedValue {
  constructor (defaultValue) {
    super(defaultValue)

    this.interpolator = AnimatedNumber.interpolator
  }

  static interpolator ({ currentTime, keys, defaultValue }) {
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
    if (!Number.isFinite(closestLeft)) return keys.get(closestRight)[0]
    // return the left key's value if there are none on the right
    if (!Number.isFinite(closestRight)) return keys.get(closestLeft)[0]

    // interpolate value
    let left = AnimatedValue.resolveKey(keys, closestLeft, defaultValue)
    let right = AnimatedValue.resolveKey(keys, closestRight, defaultValue)
    // current time within the interval from 0 to 1
    let intervalTime = (currentTime - closestLeft) / (closestRight -
      closestLeft)
    // apply easing function or linear easing if none specified
    let easingValue = (right[1].function || Easing.linear)(intervalTime,
      ...(right[1].parameters || []))

    // return interpolated value
    return (right[0] - left[0]) * easingValue + left[0]
  }

  static springInterpolator ({ currentTime, keys, defaultValue, deltaTime,
      settings }) {
    // get the interpolated value from the default interpolator
    let target = AnimatedNumber.interpolator({
      currentTime, keys, defaultValue, deltaTime, settings
    })

    // make sure springPosition and springVelocity exist
    if (!settings.hasOwnProperty('springPosition')) {
      // find closest key
      let closestLeft = -Infinity
      let closestRight = Infinity
      for (let time of keys.keys()) {
        if (time <= currentTime && time > closestLeft) closestLeft = time
        if (time > currentTime && time < closestRight) closestRight = time
      }
      // set springPosition to the closest key's value, 0 otherwise
      if (Number.isFinite(closestLeft)) {
        settings.springPosition = AnimatedValue
          .resolveKey(keys, closestLeft, defaultValue)[0]
      } else if (Number.isFinite(closestRight)) {
        settings.springPosition = AnimatedValue
          .resolveKey(keys, closestRight, defaultValue)[0]
      } else settings.springPosition = defaultValue
      // initial velocity is always 0
      settings.springVelocity = 0
    }

    let x = settings.springPosition // current value
    let v = settings.springVelocity // velocity
    let f = settings.spring[0] | 0  // force
    let d = settings.spring[1] | 0  // deceleration factor

    // magic
    v = (v + f * deltaTime * (target - x)) * (1 / (1 + d * deltaTime))
    x += v * deltaTime

    // store variables
    settings.springPosition = x
    settings.springVelocity = v

    return x
  }
}
