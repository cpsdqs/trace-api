const topCanvas = document.querySelector('#top-canvas')

{
  let ctx = topCanvas.getContext('2d')
  ctx.resetTransform = function () { ctx.setTransform(1, 0, 0, 1, 0, 0) }

  let timeline = new Trace.Timeline(ctx)
  let viewport = new Trace.Viewport()

  let resizeTopCanvas = function () {
    let rect = topCanvas.getBoundingClientRect()
    viewport.canvasWidth = topCanvas.width = window.devicePixelRatio * rect.width
    viewport.canvasHeight = topCanvas.height = window.devicePixelRatio * rect.height
    timeline.draw(ctx, [1, 0, 0, 0, 1, 0, 0, 0, 1], timeline.currentTime, 0)
  }
  resizeTopCanvas()
  window.addEventListener('resize', resizeTopCanvas)

  viewport.width = 960
  viewport.height = 540
  viewport.contentSize = 'cover'

  timeline.run()
  timeline.addChild(viewport)

  class Circle extends Trace.Object {
    constructor () {
      super()

      this.radius = new Trace.AnimatedNumber(0)
    }
    drawSelf (ctx, transform, currentTime, deltaTime) {
      Trace.Utils.resetCtx(ctx)
      Trace.Utils.setTransformMatrix(ctx, transform)

      const radius = this.radius.getValue(currentTime, deltaTime)

      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  {
    let family = "'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Roboto, sans-serif"

    let title = new Trace.ClippedText()
    viewport.addChild(title)
    title.text.addKey(0, 'Trace')
    title.color.addKey(0, '#fff')
    title.family.addKey(0, family)
    title.weight.addKey(0, 600)
    title.size.addKey(0, 60)
    title.compensation.addKey(0, 1)
    title.skew.addKey(0, Math.PI / 6)
    title.transform.translateX.addKey(0, 480)
    title.transform.translateY.addKey(0, 270)
    title.transform.scaleX.addKey(0, 0.5)
    title.transform.scaleY.addKey(0, 0.5)
    title.transform.scaleX.addKey(1, 1, Trace.Easing.easeOutExpo)
    title.transform.scaleY.addKey(1, 1, Trace.Easing.easeOutExpo)
    title.transform.scaleX.addKey(2, 0.5, Trace.Easing.easeInExpo)
    title.transform.scaleY.addKey(2, 0.5, Trace.Easing.easeInExpo)
    title.clip.addKey(0, -1)
    title.clip.addKey(1, 0, Trace.Easing.easeOutExpo)
    title.clip.addKey(2, 1, Trace.Easing.easeInExpo)

    let circle = new Circle()
    viewport.addChild(circle)
    circle.transform.translateX.addKey(0, 480)
    circle.transform.translateY.addKey(0, 270)
    circle.radius.addKey(2, 0)
    circle.radius.addKey(3, Math.hypot(960, 540) / 2, Trace.Easing.easeOutExpo)
  }

  timeline.play()
  timeline.duration = 3
  timeline.on('timeupdate', () => {
    if (timeline.currentTime >= 3) timeline.stop()
  })
}
