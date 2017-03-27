const Trace = window.Trace

class ExampleObject extends Trace.Object {
  drawSelf (ctx, transform, currentTime, deltaTime) {
    Trace.Utils.setTransformMatrix(ctx, transform)
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#637bc5'
    ctx.font = '10px Operator Mono, Menlo, Monaco, Inconsolata, Consolas, ' +
      'Lucida Console, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.globalAlpha = this.opacity.getValue(currentTime, deltaTime)
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineDashOffset = 0
    ctx.setLineDash([])
    ctx.strokeText('[Object]', 0, 0)
    ctx.fillText('[Object]', 0, 0)
    ctx.fillStyle = '#4ebc6b'
    ctx.beginPath()
    ctx.arc(0, 0, 1, 0, 2 * Math.PI)
    ctx.fill()
  }
}

const createContext = function (title, duration) {
  const container = document.createElement('div')
  container.className = 'container'
  container.innerHTML = `<div class="title">${title} (click to start)</div>`
  const canvas = document.createElement('canvas')
  container.appendChild(canvas)
  document.body.appendChild(container)
  canvas.width = 480 * window.devicePixelRatio
  canvas.height = 360 * window.devicePixelRatio

  const timeline = new Trace.Timeline(canvas.getContext('2d'))
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
  viewport.canvasWidth = 480
  viewport.canvasHeight = 360
  viewport.width = 480
  viewport.height = 360
  viewport.canvasScale = window.devicePixelRatio
  return viewport
}

{
  const viewport = createContext('Object Transform Test', 6)
  const object = new ExampleObject()
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
}
{
  const viewport = createContext('Object Opacity Test', 2)
  const object = new ExampleObject()
  viewport.addChild(object)
  object.addKeys({
    transform: { translateX: 240, translateY: 180 },
    opacity: { 0: 1, 1: 0, 2: 1 }
  })
}
{
  const viewport = createContext('Spring Interpolator Test', 5)
  const object = new ExampleObject()
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
  const obj = new ExampleObject()
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
{
  const viewport = createContext('Color Test', 3)
  class ColorSquare extends Trace.Object {
    constructor () {
      super()
      this.color = new Trace.AnimatedColor('black')
      viewport.addChild(this)
    }
    drawSelf (ctx, transform, currentTime, deltaTime) {
      Trace.Utils.setTransformMatrix(ctx, transform)
      ctx.fillStyle = this.color.getValue(currentTime, deltaTime)
      ctx.fillRect(0, 0, 20, 20)
    }
  }
  let cycle = {
    0: '#f00', 1: '#0f0', 2: '#00f', 3: '#f00'
  }
  let a = new ColorSquare()
  a.addKeys({ color: cycle })
  let b = new ColorSquare()
  b.addKeys({
    transform: { translateX: 20 },
    color: cycle
  })
  b.color.interpolatorSettings = { model: 'hsl' }
  let c = new ColorSquare()
  c.addKeys({
    transform: { translateX: 40 },
    color: {
      0: 'rgba(127, 0, 0, 0.5)',
      1: '#f00'
    }
  })
  let rainbow = new ColorSquare()
  rainbow.addKeys({
    transform: { translateX: 60 },
    color: { 0: '#f00', 3: '#f01' }
  })
  rainbow.color.interpolatorSettings = { model: 'hsl' }
  let newCycle = function (x, model) {
    let d = new ColorSquare()
    d.addKeys({
      transform: { translateX: x, translateY: 20 },
      color: cycle
    })
    d.color.interpolatorSettings = { model }
    let label = new Trace.ClippedText()
    viewport.addChild(label)
    label.addKeys({
      transform: { translateX: x + 10, translateY: 50, rotateZ: Math.PI / 4 },
      text: model,
      size: 12,
      align: 'left'
    })
  }
  newCycle(0, 'rgb')
  newCycle(20, 'hsl')
  newCycle(40, 'hsv')
  newCycle(60, 'hwb')
  newCycle(80, 'cmyk')
  newCycle(100, 'xyz')
  newCycle(120, 'lab')
  newCycle(140, 'lch')
  newCycle(160, 'ansi16')
  newCycle(180, 'ansi256')
  newCycle(200, 'hcg')
  newCycle(220, 'apple')
}
{
  const viewport = createContext('Subcontext Test', 4)
  class FPSMeter extends Trace.Object {
    drawSelf (ctx, transform, currentTime, deltaTime) {
      Trace.Utils.setTransformMatrix(ctx, transform)
      ctx.fillStyle = '#000'
      ctx.textBaseline = 'top'
      ctx.textAlign = 'left'
      ctx.font = '24px monospace'
      let fps = Math.round(1 / deltaTime).toString()
      fps = ' '.repeat(Math.max(0, 3 - fps.length)) + fps
      ctx.fillText(fps + 'fps', 0, 0)
    }
  }
  viewport.addChild(new FPSMeter())
  const subcontext = new Trace.Subcontext(200, 200)
  viewport.addChild(subcontext)
  subcontext.filter = function (ctx, _, currentTime) {
    ctx.resetTransform()
    let id = ctx.getImageData(0, 0, subcontext.realWidth, subcontext.realHeight)
    let d = id.data
    if (currentTime < 1) {
      for (let i = 0; i < d.length; i += 4) {
        d[i] = 255 - d[i]
        d[i + 1] = 255 - d[i + 1]
        d[i + 2] = 255 - d[i + 2]
      }
    } else if (currentTime < 2) {
      for (let i = 0; i < d.length; i += 4) {
        d[i] = d[i + 1]
        d[i + 1] = 255 * Math.cos(Math.PI * currentTime - Math.PI)
        d[i + 2] = 255 * Math.sin(Math.PI * currentTime - Math.PI)
      }
    } else {
      let w = subcontext.realWidth * 4
      let y = 0
      let realHeight = subcontext.realHeight
      let scaleX = subcontext.scaleX
      let scaleY = subcontext.scaleY
      let shiftr, shiftg, shiftb, shifta, height
      while (y < realHeight) {
        shiftr = Math.floor(10 * (2 * Math.random() - 1) * scaleX)
        shiftg = Math.floor(10 * (2 * Math.random() - 1) * scaleX)
        shiftb = Math.floor(10 * (2 * Math.random() - 1) * scaleX)
        shifta = Math.floor(10 * (2 * Math.random() - 1) * scaleX)
        height = Math.floor(Math.random() * 40 * scaleY) + 1
        for (let dy = 0; dy < height; dy++) {
          for (let x = 0; x < w; x++) {
            d[w * y + 4 * (x + shiftr) % w] = d[w * y + 4 * x]
            d[w * y + 4 * (x + shiftg) % w + 1] = d[w * y + 4 * x + 1]
            d[w * y + 4 * (x + shiftb) % w + 2] = d[w * y + 4 * x + 2]
            d[w * y + 4 * (x + shifta) % w + 3] = d[w * y + 4 * x + 3]
          }
          y++
        }
      }
    }
    ctx.putImageData(id, 0, 0)
  }
  subcontext.addKeys({
    transform: {
      translateX: 100,
      translateY: 100
    }
  })
  const obj = new ExampleObject()
  subcontext.addChild(obj)
  obj.addKeys({
    transform: {
      translateX: {
        0: 0,
        1: [100, Trace.Easing.easeOutExpo],
        2: [150, Trace.Easing.easeInOutExpo],
        3: [100, Trace.Easing.easeInOutExpo]
      },
      translateY: 100,
      scaleX: 2,
      scaleY: 2
    }
  })
  const text = new Trace.ClippedText()
  subcontext.addChild(text)
  text.addKeys({
    text: 'Hello world!',
    color: '#0af',
    transform: {
      translateX: 10,
      translateY: 30
    },
    align: 'left'
  })
}
