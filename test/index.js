const Trace = window.Trace

const createContext = function (title, duration) {
  const container = document.createElement('div')
  container.className = 'container'
  container.innerHTML = `<div class="title">${title}</div>`
  const canvas = document.createElement('canvas')
  container.appendChild(canvas)
  document.body.appendChild(container)
  canvas.width = 480 * window.devicePixelRatio
  canvas.height = 360 * window.devicePixelRatio

  const ctx = canvas.getContext('2d')
  // polyfill resetTransform
  ctx.resetTransform = function () { ctx.setTransform(1, 0, 0, 1, 0, 0) }

  const timeline = new Trace.Timeline(ctx)
  const viewport = new Trace.Viewport()
  timeline.addChild(viewport)
  timeline.duration = duration
  timeline.on('timeupdate', () => {
    if (timeline.currentTime >= timeline.duration) {
      timeline.stop()
      container.querySelector('.title').textContent = `${title} (click to start)`
    }
  })
  canvas.addEventListener('click', e => {
    if (timeline.paused) {
      timeline.currentTime = 0
      timeline.run()
      timeline.play()
      container.querySelector('.title').textContent = title
    }
  })
  timeline.run()
  timeline.play()
  viewport.canvasWidth = 480
  viewport.canvasHeight = 360
  viewport.width = 480
  viewport.height = 360
  viewport.canvasScale = window.devicePixelRatio
  return viewport
}

{
  const viewport = createContext('Object Transform Test', 6)
  const object = new Trace.Object()
  viewport.addChild(object)
  object.transform.translateX.addKey(0, 240)
  object.transform.translateY.addKey(0, 180)
  object.transform.translateX.addKey(1, 140)
  object.transform.scaleX.addKey(1, 1)
  object.transform.scaleX.addKey(2, 2)
  object.transform.scaleY.addKey(1.5, 1)
  object.transform.scaleY.addKey(2.5, 2)
  object.transform.rotateZ.addKey(3, 0)
  object.transform.rotateZ.addKey(4, Math.PI)
  object.transform.skewX.addKey(4, 0)
  object.transform.skewX.addKey(5, Math.PI)
  object.transform.skewY.addKey(5, 0)
  object.transform.skewY.addKey(6, -Math.PI)
}
{
  const viewport = createContext('Object Opacity Test', 2)
  const object = new Trace.Object()
  viewport.addChild(object)
  object.transform.translateX.addKey(0, 240)
  object.transform.translateY.addKey(0, 180)
  object.opacity.addKey(0, 1)
  object.opacity.addKey(1, 0)
  object.opacity.addKey(2, 1)
}
{
  const viewport = createContext('Spring Interpolator Test', 5)
  const object = new Trace.Object()
  viewport.addChild(object)
  object.transform.translateX.interpolator = Trace.AnimatedNumber.springInterpolator
  object.transform.translateX.interpolatorSettings = { spring: [300, 20] }
  object.transform.translateX.addKey(0, 240)
  object.transform.translateY.addKey(0, 180)
  object.transform.translateX.addKey(1, 140, Trace.Easing.step)
  object.transform.translateX.addKey(2, 340, Trace.Easing.step)
  object.transform.translateX.addKey(3, 140, Trace.Easing.step)
  object.transform.translateX.addKey(3.2, 340, Trace.Easing.step)
}
{
  const viewport = createContext('Easing Test', 3)
  let baseEasings = [
    'Sine', 'Quad', 'Cubic', 'Quart', 'Quint', 'Expo', 'Circ', 'Back'
  ]
  let easings = []
  for (let i of baseEasings) {
    easings.push(`easeIn${i}`)
    easings.push(`easeOut${i}`)
    easings.push(`easeInOut${i}`)
  }
  let posY = 0
  for (let easing of easings) {
    const text = new Trace.ClippedText()
    viewport.addChild(text)
    text.text.addKey(0, easing)
    text.align.addKey(0, 'left')
    text.transform.translateX.addKey(0, 50)
    text.transform.translateY.addKey(0, 10 + posY)
    text.size.addKey(0, 12)
    posY += 13
    text.transform.translateX.addKey(1, 360, Trace.Easing[easing])
    text.transform.translateX.addKey(2, 360)
    text.transform.translateX.addKey(3, 50, Trace.Easing[easing])
  }
}
{
  const viewport = createContext('ClippedText Test', 8)
  const ct = new Trace.ClippedText()
  viewport.addChild(ct)
  ct.transform.translateX.addKey(0, 240)
  ct.transform.translateY.addKey(0, 180)
  ct.text.addKey(0, 'Something')
  ct.text.addKey(1, 'Text text text text text')
  ct.clip.addKey(1, 0)
  ct.clip.addKey(2, -1, Trace.Easing.easeInExpo)
  ct.clip.addKey(3, 1, Trace.Easing.easeInOutQuad)
  ct.clip.addKey(3.2, 0.5, Trace.Easing.easeOutBack)
  ct.compensation.addKey(3.2, 0)
  ct.compensation.addKey(3.7, 1, Trace.Easing.easeInOutExpo)
  ct.skew.addKey(4, 0)
  ct.skew.addKey(4.5, Math.PI / 3, Trace.Easing.easeInOutQuad)
  ct.color.addKey(4.5, '#000')
  ct.color.addKey(5, '#66baa6', Trace.Easing.easeOutExpo)
  ct.family.addKey(0, 'sans-serif')
  ct.family.addKey(4.5, '"Source Code Pro", Roboto, monospace')
  ct.weight.addKey(5, 400)
  ct.weight.addKey(5.5, 100)
  ct.weight.addKey(6, 900, Trace.Easing.easeOutQuad)
  ct.weight.addKey(6.1, 400)
  ct.style.addKey(0, 'normal')
  ct.style.addKey(6, 'italic')
  ct.align.addKey(0, 'center')
  ct.align.addKey(6.5, 'left')
  ct.align.addKey(7, 'right')
  ct.baseline.addKey(0, 'middle')
  ct.baseline.addKey(6.5, 'top')
  ct.baseline.addKey(7, 'bottom')
  ct.baseline.addKey(7.1, 'middle')
  ct.align.addKey(7.1, 'center')
  ct.clip.addKey(7.5, Trace.AnimatedValue.PREV_KEY)
  ct.clip.addKey(8, 0, Trace.Easing.easeOutExpo)
  ct.color.addKey(7.5, Trace.AnimatedValue.PREV_KEY)
  ct.color.addKey(8, '#000')
}
{
  const viewport = createContext('ClippedContainer Test', 3)
  const cc = new Trace.ClippedContainer()
  viewport.addChild(cc)
  const obj = new Trace.Object()
  cc.addChild(obj)
  cc.transform.translateX.addKey(0, 240)
  cc.transform.translateY.addKey(0, 180)
  obj.transform.scaleX.addKey(0, 5)
  obj.transform.scaleY.addKey(0, 5)

  cc.clip = function (ctx, transform, currentTime, deltaTime) {
    Trace.Utils.setTransformMatrix(ctx, transform)

    ctx.beginPath()
    ctx.moveTo(-240 + 500 * Math.sin(currentTime), -20 + 50 * Math.sin(currentTime))
    ctx.lineTo(480, -180)
    ctx.lineTo(480, 180)
    ctx.lineTo(0, 180)
    ctx.closePath()
    ctx.clip()
  }
}
