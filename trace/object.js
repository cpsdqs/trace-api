const EventEmitter = require('events')
const stable = require('stable')
const glMatrix = require('gl-matrix')
const Transform = require('./transform')
const AnimatedNumber = require('./animated-number')
const AnimatedBoolean = require('./animated-boolean')
const Utils = require('./utils')

module.exports = class TraceObject extends EventEmitter {
  constructor () {
    super()

    this.parentNode = null
    this.transform = new Transform()
    this.opacity = new AnimatedNumber(1)
    this.enabled = new AnimatedBoolean(true)
    this.zIndex = new AnimatedNumber(0)
    this.children = new Set()

    this.on('connected', () => {
      for (let i of this.children.values()) i.emit('connected')
    })
    this.on('disconnected', () => {
      for (let i of this.children.values()) i.emit('disconnected')
    })
  }

  sortChildren (currentTime, deltaTime) {
    let values = new Map()
    for (let i of this.children.values()) {
      values.set(i, [i.zIndex.getValue(currentTime, deltaTime),
        i.enabled.getValue(currentTime, deltaTime)])
    }
    let sortedChildren = stable([...values.keys()], (a, b) => {
      return values.get(a)[0] > values.get(b)[0]
    })
    return {
      values,
      children: sortedChildren
    }
  }

  drawChildren (ctx, transform, currentTime, deltaTime) {
    let {values, children} = this.sortChildren(currentTime, deltaTime)

    for (let node of children) {
      if (values.get(node)[1] === true) {
        Utils.resetCtx(ctx)
        node.draw(ctx, transform, currentTime, deltaTime)
      }
    }
  }

  draw (ctx, parentTransform, currentTime, deltaTime) {
    let rawTransform = this.transform.getMatrix(currentTime, deltaTime)
    let transform = glMatrix.mat4.create()
    glMatrix.mat4.multiply(transform, parentTransform, rawTransform)

    this.drawSelf(ctx, transform, currentTime, deltaTime)
    this.drawChildren(ctx, transform, currentTime, deltaTime)
  }

  drawSelf (ctx, transform, currentTime, deltaTime) {}

  addChild (...childNodes) {
    for (let childNode of childNodes) {
      if (childNode.parentNode !== null && childNode.parentNode !== this) {
        throw new Error('Child node already has a parent')
      }
      this.children.add(childNode)
      childNode.parentNode = this
      childNode.emit('connected')
    }
  }
  removeChild (...childNodes) {
    let removed = []
    for (let childNode of childNodes) {
      if (childNode.parentNode !== this) {
        throw new Error('Not a child node of this object')
      }
      childNode.emit('disconnected')
      childNode.parentNode = null
      removed.push(this.children.delete(childNode))
    }
    return removed.length === 1 ? removed[0] : removed
  }
  hasChild (childNode) {
    return this.children.has(childNode)
  }

  closest (fn) {
    if (fn(this)) return this
    if (this.parentNode) return this.parentNode.closest(fn)
    return null
  }

  addKeys (props) {
    for (let prop in props) {
      let property = this
      for (let key of prop.split('.')) {
        property = property[key]
        if (!property) break
      }
      if (!property) {
        console.warn('property not found: ' + prop)
        continue
      }

      let val = props[prop]
      let didWarn = false
      if (typeof val === 'object') {
        for (let time in val) {
          if (!time.match(/^[+-]?(?:\d+?(?:\.\d+?)?|\.\d+?)?$/)) {
            this.addKeys({ [`${prop}.${time}`]: val[time] })
            continue
          }
          let t = parseFloat(time)
          let v = val[time]
          if (!Array.isArray(v)) v = [v]
          if (property.addKey) property.addKey(t, ...v)
          else if (!didWarn) {
            console.warn(prop + ' has no addKey method')
            didWarn = true
          }
        }
      } else {
        property.defaultValue = val
      }
    }
  }
}
