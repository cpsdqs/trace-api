const Trace = require('../trace')

let CanvasConstructor
let ImageConstructor
let loadCanvas = function () {
  if (typeof window !== 'undefined') {
    // if (typeof window.OffscreenCanvas !== 'undefined') {
      // CanvasConstructor = window.OffscreenCanvas doesn't support text
    CanvasConstructor = (w, h) => {
      let canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      return canvas
    }
    ImageConstructor = window.Image
    // } else {
      // throw new Error('No OffscreenCanvas in window')
    // }
  } else {
    let NodeCanvas
    try {
      NodeCanvas = require('canvas')
    } catch (err) {
      throw new Error('No canvas module')
    }
    CanvasConstructor = (...args) => new NodeCanvas(...args)
    ImageConstructor = NodeCanvas.Image
  }
}

module.exports = class Subcontext extends Trace.Object {
  constructor (width, height) {
    super()

    if (!CanvasConstructor) loadCanvas()

    this.width = width
    this.height = height
    // origin when drawing to the context
    this.originX = new Trace.AnimatedNumber(0)
    this.originY = new Trace.AnimatedNumber(0)

    // or just use something that implements getMatrix() -> Array(16)
    this.subTransform = null

    // whether or not to scale the canvas according to the parent's scale
    // such that pixels map one on one again
    this.inheritScale = true
    this.scaleX = 1
    this.scaleY = 1

    // will only draw when time changes if false
    this.alwaysRedraw = true
    this.__lastDrawTime = null

    // origin when drawing this object
    this.anchorX = new Trace.AnimatedNumber(0)
    this.anchorY = new Trace.AnimatedNumber(0)
    this.canvas = { width: -Infinity, height: -Infinity }
    this.subctx = {}
    this.buffer = new ImageConstructor(0, 0)

    this.filter = function () {}

    this.updateCanvas()
  }
  get realWidth () {
    return this.width * this.scaleX
  }
  get realHeight () {
    return this.height * this.scaleY
  }
  set realWidth (v) {
    this.width = v / this.scaleX
  }
  set realHeight (v) {
    this.height = v / this.scaleY
  }
  updateCanvas () {
    let w = this.realWidth
    let h = this.realHeight
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas = CanvasConstructor(w, h)
      this.subctx = this.canvas.getContext('2d')
    }
    if (this.buffer.width !== w && this.buffer.height !== h) {
      this.buffer = new ImageConstructor(w, h)
    }
  }
  drawSubcontext (ctx, transform, currentTime, deltaTime) {
    let {values, children} = this.sortChildren(currentTime, deltaTime)

    let sx = this.inheritScale ? (this.scaleX = transform[0]) : 1
    let sy = this.inheritScale ? (this.scaleY = transform[5]) : 1
    let dx = this.originX.getValue(currentTime, deltaTime)
    let dy = this.originY.getValue(currentTime, deltaTime)
    let subTransform = [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, 1, 0, dx, dy, 0, 1]
    if (this.subTransform) subTransform = this.subTransform.getMatrix()

    this.updateCanvas()

    this.subctx.setTransform(1, 0, 0, 1, 0, 0)
    this.subctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let node of children) {
      if (values.get(node)[1] === true) {
        Trace.Utils.resetCtx(this.subctx)
        node.draw(this.subctx, subTransform, currentTime, deltaTime)
      }
    }

    this.filter(this.subctx, subTransform, currentTime, deltaTime)

    this.buffer.src = this.canvas.toDataURL()
  }
  drawChildren (ctx, transform, currentTime, deltaTime) {
    if (this.alwaysRedraw || this.__lastDrawTime !== currentTime) {
      this.drawSubcontext(ctx, transform, currentTime, deltaTime)
      this.__lastDrawTime = currentTime
    }
  }
  drawSelf (ctx, transform, currentTime, deltaTime) {
    Trace.Utils.setTransformMatrix(ctx, transform)

    ctx.translate(
      -this.anchorX.getValue(currentTime, deltaTime),
      -this.anchorY.getValue(currentTime, deltaTime)
    )
    ctx.scale(1 / this.scaleX, 1 / this.scaleY)

    ctx.drawImage(this.buffer, 0, 0)
  }
}
