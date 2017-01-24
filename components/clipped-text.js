const Trace = require('../trace')

module.exports = class ClippedText extends Trace.Object {
  constructor () {
    super()

    // text content
    this.text = new Trace.AnimatedString('')

    // clip at -1: clip to left
    // clip at 0: no clip
    // clip at 1: clip to right
    this.clip = new Trace.AnimatedNumber(0)

    // clip skew
    this.skew = new Trace.AnimatedNumber(0)

    // font family
    this.family = new Trace.AnimatedString('sans-serif')

    // font weight
    this.weight = new Trace.AnimatedNumber(400)

    // font size
    this.size = new Trace.AnimatedNumber(16)

    // font style
    this.style = new Trace.AnimatedString('normal')

    // text color
    this.color = new Trace.AnimatedColor('#000')

    // horizontal align (left|center|right)
    this.align = new Trace.AnimatedString('center')

    // vertical align (top|middle|bottom)
    this.baseline = new Trace.AnimatedString('middle')

    // how much to center the result if necessary
    this.compensation = new Trace.AnimatedNumber(0)
  }

  drawSelf (ctx, transform, currentTime, deltaTime) {
    Trace.Utils.resetCtx(ctx)
    Trace.Utils.setTransformMatrix(ctx, transform)

    const opacity = this.opacity.getValue(currentTime, deltaTime)
    const text = this.text.getValue(currentTime, deltaTime)
    const clip = this.clip.getValue(currentTime, deltaTime)
    const family = this.family.getValue(currentTime, deltaTime)
    const weight = Math.round(this.weight.getValue(currentTime, deltaTime) / 100) * 100
    const size = +this.size.getValue(currentTime, deltaTime).toFixed(3)
    const style = this.style.getValue(currentTime, deltaTime)
    const color = this.color.getValue(currentTime, deltaTime)
    const align = this.align.getValue(currentTime, deltaTime)
    const baseline = this.baseline.getValue(currentTime, deltaTime)
    const skew = Math.tan(this.skew.getValue(currentTime, deltaTime)) * size * 1.3
    const compensation = this.compensation.getValue(currentTime, deltaTime)

    const font = `${weight} ${style} ${size}px ${family}`
    ctx.font = font

    const width = ctx.measureText(text).width

    // left edge of mask
    const left = -width / 2 + (width + skew) * clip
    // right edge of mask
    const right = width / 2 + (width + skew) * clip
    // top edge of mask
    const top = -size / 2 * 1.3
    // bottom edge of mask
    const bottom = size / 2 * 1.3

    // translate according to alignment settings
    if (align === 'left') ctx.translate(width / 2, 0)
    else if (align === 'right') ctx.translate(-width / 2, 0)
    if (baseline === 'top') ctx.translate(0, size / 2)
    else if (baseline === 'bottom') ctx.translate(0, -size / 2)

    // compensate for clip offset
    ctx.translate(-width / 2 * clip * compensation, 0)

    // clip skewed rectangle mask (if necessary)
    ctx.save()
    if (clip !== 0) {
      ctx.beginPath()
      ctx.moveTo(left, top)
      ctx.lineTo(right + skew, top)
      ctx.lineTo(right, bottom)
      ctx.lineTo(left - skew, bottom)
      ctx.closePath()
      ctx.clip()
    }

    // draw text
    ctx.globalAlpha = opacity
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color
    ctx.fillText(text, 0, 0)

    ctx.restore()
  }
}
