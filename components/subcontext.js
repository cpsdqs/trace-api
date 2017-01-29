const Trace = require('../trace')

let CanvasConstructor
let ImageConstructor
let loadCanvas = function () {
  if (typeof window !== 'undefined') {
    if (typeof window.OffscreenCanvas !== 'undefined') {
      CanvasConstructor = window.OffscreenCanvas
      ImageConstructor = window.Image
    } else {
      throw new Error('No OffscreenCanvas in window')
    }
  } else {
    let nodeCanvas
    try {
      nodeCanvas = require('canvas')
    } catch (err) {
      throw new Error('No canvas module')
    }
    CanvasConstructor = nodeCanvas
    ImageConstructor = nodeCanvas.Image
  }
  return CanvasConstructor
}

module.exports = class Subcontext extends Trace.Object {
  constructor (width, height) {
    super()

    this.CanvasConstructor = CanvasConstructor
    if (!CanvasConstructor) this.CanvasConstructor = loadCanvas()

    this.width = width
    this.height = height
    // origin when drawing to the context
    this.originX = new Trace.AnimatedNumber(0)
    this.originY = new Trace.AnimatedNumber(0)

    // or just use something that implements getMatrix() -> Array(16)
    this.subTransform = null

    // origin when drawing this object
    this.anchorX = new Trace.AnimatedNumber(0)
    this.anchorY = new Trace.AnimatedNumber(0)
    this.canvas = { width: -Infinity, height: -Infinity }
    this.subctx = {}
    this.buffer = new ImageConstructor(0, 0)

    this.updateCanvas()
  }
  updateCanvas () {
    if (this.canvas.width !== this.width || this.canvas.height !== this.height) {
      this.canvas = new this.CanvasConstructor(this.width, this.height)
      this.subctx = this.canvas.getContext('2d')
    }
  }
  drawChildren (ctx, transform, currentTime, deltaTime) {
    let {values, children} = this.sortChildren(currentTime, deltaTime)

    let dx = this.originX.getValue(currentTime, deltaTime)
    let dy = this.originY.getValue(currentTime, deltaTime)
    let subTransform = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, dx, dy, 0, 1]
    if (this.subTransform) subTransform = this.subTransform.getMatrix()
    let subctx = this.subctx

    this.subctx.setTransform(1, 0, 0, 1, 0, 0)
    this.subctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let node of children) {
      if (values.get(node)[1] === true) {
        Trace.Utils.resetCtx(subctx)
        node.draw(subctx, subTransform, currentTime, deltaTime)
      }
    }
  }
  drawSelf (ctx, transform, currentTime, deltaTime) {
    Trace.Utils.setTransformMatrix(ctx, transform)

    ctx.translate(
      -this.anchorX.getValue(currentTime, deltaTime),
      -this.anchorY.getValue(currentTime, deltaTime)
    )

    ctx.drawImage(this.buffer, 0, 0)
  }
}
