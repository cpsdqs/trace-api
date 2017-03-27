const color = require('color')
const AnimatedValue = require('./animated-value')
const Easing = require('./easing')

const black = color()

const validModels = []
for (let i in color) if (i) validModels.push(i)

module.exports = class AnimatedColor extends AnimatedValue {
  constructor (defaultValue) {
    super(defaultValue)

    this.interpolator = AnimatedColor.interpolator
  }

  static interpolator ({ currentTime, keys, defaultValue, deltaTime,
      settings }) {
    // find closest keys before and after current time
    let closestLeft = -Infinity
    let closestRight = Infinity

    for (let time of keys.keys()) {
      if (time <= currentTime && time > closestLeft) closestLeft = time
      if (time > currentTime && time < closestRight) closestRight = time
    }

    let left = AnimatedValue.resolveKey(keys, closestLeft, defaultValue)
    let right = AnimatedValue.resolveKey(keys, closestRight, defaultValue)

    // parse colors with failsafe
    let leftColor = black
    let rightColor = black
    try {
      leftColor = color(left[0])
    } catch (err) {}
    try {
      rightColor = color(right[0])
    } catch (err) {}

    // return default value if no keys are available
    if (!Number.isFinite(closestLeft) && !Number.isFinite(closestRight)) {
      return defaultValue
    }
    // return the right key's value if there are none on the left
    if (!Number.isFinite(closestLeft)) return rightColor.rgb().string()
    // return the left key's value if there are none on the right
    if (!Number.isFinite(closestRight)) return leftColor.rgb().string()

    let model = 'rgb'
    if (validModels.includes(settings.model)) {
      model = settings.model
    }

    // interpolate value
    let leftArray = leftColor[model]().array()
    let rightArray = rightColor[model]().array()

    let intervalTime = (currentTime - closestLeft) / (closestRight -
      closestLeft)
    let easingValue = (right[1].function || Easing.linear)(intervalTime,
      ...(right[1].parameters || []))

    // make sure alpha exists if necessary
    let result = (rightColor.alpha() < leftColor.alpha())
      ? rightColor[model]().array()
      : leftColor[model]().array()

    for (let i in result) {
      let l = leftArray[i] || 1
      let r = rightArray[i] || 1
      result[i] = (r - l) * easingValue + l
    }

    if (settings.type === 'array') return color(result, model).rgb().array()
    if (settings.type === 'number') {
      // reverse array and sum all entries with increasing factor
      // this also removes the need to check for alpha
      let rgb = color(result, model).rgb().array().reverse()
      let factor = 256
      let number = 0
      for (let value of rgb) {
        number += value * factor
        factor **= 2
      }
      return number
    }
    return color(result, model).rgb().string()
  }
}
