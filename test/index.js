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
  object.addKeys({
    transform: {
      translateX: { 0: 240, 1: 140 },
      translateY: 180,
      scaleX: { 1: 1, 2: 2 },
      scaleY: { 1.5: 1, 2.5: 2 },
      rotateZ: { 3: 0, 4: Math.PI },
      skewX: { 4: 0, 5: Math.PI },
      skewY: { 5: 0, 6: -Math.PI }
    }
  })
  window.o = object
}
{
  const viewport = createContext('Object Opacity Test', 2)
  const object = new Trace.Object()
  viewport.addChild(object)
  object.addKeys({
    transform: { translateX: 240, translateY: 180 },
    opacity: { 0: 1, 1: 0, 2: 1 }
  })
}
{
  const viewport = createContext('Spring Interpolator Test', 5)
  const object = new Trace.Object()
  viewport.addChild(object)
  object.transform.translateX.interpolator = Trace.AnimatedNumber.springInterpolator
  object.transform.translateX.interpolatorSettings = { spring: [300, 20] }
  object.addKeys({
    transform: {
      translateX: {
        0: 240,
        1: [140, Trace.Easing.step],
        2: [340, Trace.Easing.step],
        3: [140, Trace.Easing.step],
        3.2: [340, Trace.Easing.step]
      },
      translateY: 180
    }
  })
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
  ct.addKeys({
    transform: { translateX: 240, translateY: 180 },
    text: {
      0: 'Something',
      1: 'Text text text text text'
    },
    clip: {
      1: 0,
      2: [-1, Trace.Easing.easeInExpo],
      3: [1, Trace.Easing.easeInOutQuad],
      3.2: [0.5, Trace.Easing.easeOutBack],
      7.5: Trace.AnimatedValue.PREV_KEY,
      8: [0, Trace.Easing.easeOutExpo]
    },
    compensation: { 3.2: 0, 3.7: [1, Trace.Easing.easeInOutExpo] },
    skew: { 4: 0, 4.5: [Math.PI / 4, Trace.Easing.easeInOutQuad] },
    color: {
      4.5: '#000',
      5.5: ['#66baa6', Trace.Easing.easeOutQuart],
      7.5: Trace.AnimatedValue.PREV_KEY,
      8: '#000'
    },
    family: { 0: 'sans-serif', 4.5: '"Source Code Pro", Roboto, monospace' },
    weight: { 5: 400, 5.5: 100, 6: [900, Trace.Easing.easeOutQuad], 6.1: 400 },
    style: { 0: 'normal', 6: 'italic' },
    align: { 0: 'center', 6.5: 'left', 7: 'right', 7.1: 'center' },
    baseline: { 0: 'middle', 6.5: 'top', 7: 'bottom', 7.1: 'middle' }
  })
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
