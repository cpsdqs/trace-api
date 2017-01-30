const Trace = require('../trace')

let CanvasConstructor
let ImageConstructor
let loadCanvas = function () {
  if (typeof window !== 'undefined') {
    if (typeof window.OffscreenCanvas !== 'undefined') {
      // CanvasConstructor = window.OffscreenCanvas doesn't support text
      CanvasConstructor = (w, h) => {
        let canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        return canvas
      }
      ImageConstructor = window.Image
    } else {
      throw new Error('No OffscreenCanvas in window')
    }
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

    // origin when drawing this object
    this.anchorX = new Trace.AnimatedNumber(0)
    this.anchorY = new Trace.AnimatedNumber(0)
    this.canvas = { width: -Infinity, height: -Infinity }
    this.subctx = {}
    this.buffer = new ImageConstructor(0, 0)

    this.filter = function () {}

    this.updateCanvas()
  }
  updateCanvas () {
    if (this.canvas.width !== this.width || this.canvas.height !== this.height) {
      this.canvas = CanvasConstructor(this.width, this.height)
      this.subctx = this.canvas.getContext('2d')
    }
  }
  drawSubcontext (ctx, transform, currentTime, deltaTime) {
    let {values, children} = this.sortChildren(currentTime, deltaTime)

    let dx = this.originX.getValue(currentTime, deltaTime)
    let dy = this.originY.getValue(currentTime, deltaTime)
    let subTransform = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, dx, dy, 0, 1]
    if (this.subTransform) subTransform = this.subTransform.getMatrix()

    this.subctx.setTransform(1, 0, 0, 1, 0, 0)
    this.subctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let node of children) {
      if (values.get(node)[1] === true) {
        Trace.Utils.resetCtx(this.subctx)
        node.draw(this.subctx, subTransform, currentTime, deltaTime)
      }
    }

    this.filter(this.subctx, subTransform, currentTime, deltaTime)

    if (this.buffer.width !== this.width && this.buffer.height !== this.height) {
      this.buffer = new ImageConstructor(this.width, this.height)
    }
    this.buffer.src = this.canvas.toDataURL()
  }
  drawChildren (ctx, transform, currentTime, deltaTime) {
    this.drawSubcontext(ctx, transform, currentTime, deltaTime)
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
