const BezierEasing = require('bezier-easing')

module.exports = {
  linear (t) {
    return t
  },

  easeInSine (t) {
    return Math.sin((Math.PI * t - Math.PI) / 2) + 1
  },
  easeOutSine (t) {
    return Math.sin((Math.PI * t) / 2)
  },
  easeInOutSine (t) {
    return Math.sin(Math.PI * t - (Math.PI / 2)) / 2 + 0.5
  },

  easeInQuad (t) {
    return t * t
  },
  easeOutQuad (t) {
    return t * (2 - t)
  },
  easeInOutQuad (t) {
    return t < 0.5 ? (2 * t * t) : (-1 + (4 - 2 * t) * t)
  },

  easeInCubic (t) {
    return t * t * t
  },
  easeOutCubic (t) {
    return (--t) * t * t + 1
  },
  easeInOutCubic (t) {
    return t < 0.5 ? (4 * t * t * t) : ((t - 1) * (2 * t - 2) * (2 * t - 2) + 1)
  },

  easeInQuart (t) {
    return t * t * t * t
  },
  easeOutQuart (t) {
    return 1 - (--t) * t * t * t
  },
  easeInOutQuart (t) {
    return t < 0.5 ? (8 * t * t * t * t) : (1 - 8 * (--t) * t * t * t)
  },

  easeInQuint (t) {
    return t * t * t * t * t
  },
  easeOutQuint (t) {
    return 1 + (--t) * t * t * t * t
  },
  easeInOutQuint (t) {
    return t < 0.5 ? (16 * t * t * t * t * t) : (1 + 16 * (--t) * t * t * t * t)
  },

  easeInExpo (t) {
    return Math.pow(2, 10 * (t - 1))
  },
  easeOutExpo (t) {
    return 1 - Math.pow(2, -10 * t)
  },
  easeInOutExpo (t) {
    return t < 0.5 ? (Math.pow(2, 10 * (2 * t - 1)) / 2) : (1 - Math.pow(2,
      -10 * (2 * t - 1)) / 2)
  },

  easeInCirc (t) {
    return -Math.sqrt(1 - t * t) + 1
  },
  easeOutCirc (t) {
    return Math.sqrt(1 - (--t) * t)
  },
  easeInOutCirc (t) {
    return t < 0.5 ? (0.5 * (Math.sqrt(1 - (4 * t * t)) - 1))
      : (0.5 * (Math.sqrt(1 - (2 * t - 2) * (2 * t - 2)) + 1))
  },

  // from easings.net
  easeInBack (t) {
    return BezierEasing(0.6, -0.28, 0.735, 0.045)(t)
  },
  easeOutBack (t) {
    return BezierEasing(0.175, 0.885, 0.32, 1.275)(t)
  },
  easeInOutBack (t) {
    return BezierEasing(0.68, -0.55, 0.265, 1.55)(t)
  },

  step (t, start = false, count = 1) {
    return (start ? Math.ceil : Math.floor)(t * count) / count
  },

  cubicBezier (t, x1 = 0, y1 = 0, x2 = 1, y2 = 1) {
    return BezierEasing(x1, y1, x2, y2)(t)
  }
}
