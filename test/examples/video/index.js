{
  window.fps = 60
  const Trace = window.Trace
  const canvas = document.querySelector('#render-canvas')
  const timeline = new Trace.Timeline(canvas.getContext('2d'))
  const viewport = new Trace.Viewport()
  timeline.addChild(viewport)
  viewport.backgroundColor = '#000'
  viewport.canvasWidth = 960
  viewport.canvasHeight = 540
  viewport.width = 960
  viewport.height = 540

  {
    // animation
    class Burst extends Trace.Object {
      constructor () {
        super()

        this.inner = new Trace.AnimatedNumber(0)
        this.outer = new Trace.AnimatedNumber(0)
        this.lines = new Trace.AnimatedNumber(5)
        this.angleOffset = new Trace.AnimatedNumber(0)
        this.fill = new Trace.AnimatedString('#fff')
        this.stroke = new Trace.AnimatedString('')
        this.lineWidth = new Trace.AnimatedNumber(2)
        this.lineCap = new Trace.AnimatedString('round')
      }
      drawSelf (ctx, transform, currentTime, deltaTime) {
        Trace.Utils.resetCtx(ctx)
        Trace.Utils.setTransformMatrix(ctx, transform)

        ctx.globalAlpha = this.opacity.getValue(currentTime, deltaTime)

        const inner = this.inner.getValue(currentTime, deltaTime)
        const outer = this.outer.getValue(currentTime, deltaTime)
        const lines = Math.floor(this.lines.getValue(currentTime, deltaTime))
        const angleOffset = this.angleOffset.getValue(currentTime, deltaTime)
        const fill = this.fill.getValue(currentTime, deltaTime)
        const stroke = this.stroke.getValue(currentTime, deltaTime)
        const lineWidth = this.lineWidth.getValue(currentTime, deltaTime)
        const lineCap = this.lineCap.getValue(currentTime, deltaTime)

        let angle = (Math.PI * 2) / lines

        ctx.fillStyle = fill
        ctx.strokeStyle = stroke
        ctx.lineWidth = lineWidth
        ctx.lineCap = lineCap

        if (fill && outer - inner !== 0) {
          ctx.beginPath()
          ctx.arc(0, 0, outer, 0, Math.PI * 2)
          ctx.arc(0, 0, inner, 0, Math.PI * 2, true)
          ctx.fill()
        }
        if (stroke && outer - inner !== 0) {
          ctx.beginPath()
          for (let i = 0; i < lines; i++) {
            let cos = Math.cos(i * angle + angleOffset)
            let sin = Math.sin(i * angle + angleOffset)
            ctx.moveTo(cos * inner, sin * inner)
            ctx.lineTo(cos * outer, sin * outer)
          }
          ctx.stroke()
        }
      }
    }

    class Timecode extends Trace.Object {
      drawSelf (ctx, transform, currentTime, deltaTime) {
        Trace.Utils.setTransformMatrix(ctx, transform)

        ctx.font = '24px monospace'
        let inf = (Math.floor(currentTime * window.fps) % window.fps).toString()
        inf = '0'.repeat(window.fps.toString().length - inf.length) + inf
        let text = currentTime.toFixed(3) + ` ${inf}`
        let width = ctx.measureText(text).width
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(-width - 10, 0, width + 10, 34)
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'right'
        ctx.fillText(text, -5, 25)
      }
    }
    const timecode = new Timecode()
    timecode.transform.translateX.defaultValue = 960
    viewport.addChild(timecode)
    const burst = new Burst()
    viewport.addChild(burst)
    burst.addKeys({
      transform: {
        translateX: 480,
        translateY: 270
      },
      outer: {
        0: 0,
        0.9: [400, Trace.Easing.easeOutExpo]
      },
      inner: {
        0.1: 0,
        1: [400, Trace.Easing.easeOutExpo]
      }
    })
    const title = new Trace.ClippedText()
    viewport.addChild(title)
    title.addKeys({
      text: 'This is some text',
      compensation: 1,
      size: 48,
      color: '#fff',
      family: 'Pacifico, Lobster, sans-serif',
      transform: {
        translateX: 480,
        translateY: 270,
        scaleX: {
          1: 1,
          1.5: [2, Trace.Easing.step]
        },
        scaleY: {
          1: 1,
          1.5: [2, Trace.Easing.step]
        }
      },
      skew: Math.PI / 6,
      clip: {
        0.1: -1,
        1: [0, Trace.Easing.easeOutExpo],
        2: 0,
        3: [1, Trace.Easing.easeInExpo]
      }
    })
    title.transform.scaleX.interpolator = Trace.AnimatedNumber.springInterpolator
    title.transform.scaleX.interpolatorSettings = { spring: [300, 20] }
    title.transform.scaleY.interpolator = Trace.AnimatedNumber.springInterpolator
    title.transform.scaleY.interpolatorSettings = { spring: [300, 20] }
  }

  timeline.duration = 3

  const start = document.querySelector('#start')

  start.addEventListener('click', () => {
    start.textContent = 'Rendering frames'
    start.disabled = true

    let frame = 0
    let total = timeline.duration * window.fps
    let frames = []
    let loop = function () {
      timeline.currentTime = frame / window.fps
      if (frame <= total) {
        start.textContent = `Rendering frames (${frame} of ${total})`
        timeline.drawCurrent(1 / window.fps)
        frames.push(canvas.toDataURL('image/webp'))
        frame++
        setTimeout(loop, 0)
      } else {
        start.textContent = 'Converting'
        let encoder = new window.Whammy.Video(window.fps)
        for (let i of frames) {
          encoder.add(i)
        }
        encoder.compile(null, output => {
          start.textContent = 'Done'
          document.querySelector('#output-video').src = window.URL.createObjectURL(output)
        })
      }
    }
    loop()
  })
}
