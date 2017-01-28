module.exports = {
  setTransformMatrix (ctx, matrix) {
    // a b 0 0
    // c d 0 0
    // 0 0 1 0
    // e f 0 1
    ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12],
      matrix[13])
  },

  resetCtx (ctx) {
    ctx.direction = 'inherit'
    ctx.fillStyle = '#000'
    ctx.filter = 'none'
    ctx.font = '10px sans-serif'
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.imageSmoothingEnabled = true
    ctx.lineCap = 'butt'
    ctx.lineDashOffset = 0
    ctx.lineJoin = 'miter'
    ctx.miterLimit = 10
    ctx.shadowBlur = 0
    ctx.shadowColor = 'rgba(0, 0, 0, 0)'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.strokeStyle = '#000'
    ctx.textAlign = 'start'
    ctx.textBaseline = 'alphabetic'
    ctx.setLineDash([])
  }
}
