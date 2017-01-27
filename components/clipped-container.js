const Trace = require('../trace')

module.exports = class ClippedContainer extends Trace.Object {
  constructor () {
    super()

    this.clip = function () {}
  }

  drawChildren (ctx, transform, currentTime, deltaTime) {
    let {values, children} = this.sortChildren(currentTime, deltaTime)

    ctx.save()
    this.clip(ctx, transform, currentTime, deltaTime)

    for (let node of children) {
      if (values.get(node)[1] === true) {
        Trace.Utils.resetCtx(ctx)
        node.draw(ctx, transform, currentTime, deltaTime)
      }
    }

    ctx.restore()
  }

  drawSelf () {
    return
  }
}
