const Trace = window.Trace
const topCanvas = document.querySelector('#top-canvas')

{
  let timeline = new Trace.Timeline(topCanvas.getContext('2d'))
  let viewport = new Trace.Viewport()

  let resizeTopCanvas = function () {
    let rect = topCanvas.getBoundingClientRect()
    viewport.canvasWidth = topCanvas.width = window.devicePixelRatio * rect.width
    viewport.canvasHeight = topCanvas.height = window.devicePixelRatio * rect.height
    timeline.draw(timeline.ctx, [1, 0, 0, 0, 1, 0, 0, 0, 1], timeline.currentTime, 0)
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
      this.color = '#fff'
    }
    drawSelf (ctx, transform, currentTime, deltaTime) {
      Trace.Utils.resetCtx(ctx)
      Trace.Utils.setTransformMatrix(ctx, transform)

      const radius = this.radius.getValue(currentTime, deltaTime)

      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  {
    let family = "'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Roboto, sans-serif"
    let mono = "'Operator Mono', Menlo, Monaco, Inconsolata, Consolas, 'Lucida Console', monospace"

    let circle = new Circle()
    viewport.addChild(circle)
    circle.addKeys({
      transform: { translateX: 480, translateY: 270 },
      radius: { 2: 0, 3: [Math.hypot(960, 540) / 2, Trace.Easing.easeOutExpo] }
    })

    let container = new Trace.ClippedContainer()
    viewport.addChild(container)
    container.zIndex.addKey(0, 1)
    container.addKeys({
      zIndex: 1,
      transform: {
        translateX: 480,
        translateY: 270
      }
    })

    let title = new Trace.ClippedText()
    container.addChild(title)
    title.addKeys({
      text: 'Trace',
      color: { 0: '#fff', 4: ['#000', Trace.Easing.step] },
      family: family,
      weight: 600,
      size: 60,
      compensation: 1,
      skew: Math.PI / 6,
      transform: {
        translateX: 0,
        translateY: { 0: 0, 4: [-60, Trace.Easing.step] },
        scaleX: {
          0: 0.5,
          1: [1, Trace.Easing.easeOutExpo],
          2: [0.5, Trace.Easing.easeInExpo],
          4: [0.5, Trace.Easing.step],
          5: [1, Trace.Easing.easeOutExpo]
        },
        scaleY: {
          0: 0.5,
          1: [1, Trace.Easing.easeOutExpo],
          2: [0.5, Trace.Easing.easeInExpo],
          4: [0.5, Trace.Easing.step],
          5: [1, Trace.Easing.easeOutExpo]
        }
      },
      clip: {
        0: -1,
        1: [0, Trace.Easing.easeOutExpo],
        2: [1, Trace.Easing.easeInExpo],
        4: [0, Trace.Easing.step]
      },
      opacity: {
        0: 1,
        4: [0, Trace.Easing.step],
        5: [1, Trace.Easing.easeOutExpo]
      }
    })

    let ctag = new Trace.ClippedText()
    container.addChild(ctag)
    ctag.addKeys({
      text: '<      >',
      color: '#6e6e6e',
      family: mono,
      weight: 400,
      size: 60,
      compensation: 1,
      skew: Math.PI / 6,
      transform: {
        translateX: 0,
        translateY: {
          4: -30,
          5: [0, Trace.Easing.easeOutExpo]
        }
      },
      clip: {
        2.3: -1,
        3.3: [0, Trace.Easing.easeOutExpo]
      }
    })
    let ctagi = new Trace.ClippedText()
    container.addChild(ctagi)
    ctagi.addKeys({
      text: ' canvas ',
      color: '#f54784',
      family: mono,
      weight: 400,
      size: 60,
      compensation: 1,
      skew: Math.PI / 6,
      transform: {
        translateX: 0,
        translateY: {
          4: -30,
          5: [0, Trace.Easing.easeOutExpo]
        }
      },
      clip: {
        2.3: -1,
        3.3: [0, Trace.Easing.easeOutExpo]
      }
    })
    let sub = new Trace.ClippedText()
    container.addChild(sub)
    sub.addKeys({
      text: 'Animation Library',
      color: '#000',
      family: mono,
      weight: 400,
      size: 40,
      compensation: 1,
      skew: Math.PI / 6,
      transform: {
        translateX: 0,
        translateY: {
          4: 30,
          5: [60, Trace.Easing.easeOutExpo]
        }
      },
      clip: {
        2.4: -1,
        3.4: [0, Trace.Easing.easeOutExpo]
      }
    })
  }

  timeline.play()
  timeline.duration = 5
  let isWhite = false
  timeline.on('timeupdate', () => {
    if (timeline.currentTime >= timeline.duration) timeline.stop()
    if (timeline.currentTime > 3 && !isWhite) {
      document.body.classList.add('white')
      isWhite = true
    } else if (timeline.currentTime < 3 && isWhite) {
      document.body.classList.remove('white')
      isWhite = false
    }
  })
}

{
  // example
  // Draw an expanding white circle

  // Define a circle class
  class Circle extends Trace.Object {
    constructor () {
      super()

      // create an animatable property with default value 100
      this.radius = new Trace.AnimatedNumber(100)

      // another for color
      this.color = new Trace.AnimatedColor('#fff')
    }
    // called each frame
    drawSelf (ctx, transform, currentTime, deltaTime) {
      // apply parent's and own transform
      Trace.Utils.setTransformMatrix(ctx, transform)

      // get value for properties at current time
      const radius = this.radius.getValue(currentTime, deltaTime)
      const color = this.color.getValue(currentTime, deltaTime)

      ctx.fillStyle = color
      ctx.beginPath()
      // arc at (0, 0) as the transform will have been applied
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // create a new canvas
  // NOPE, actually just use the example canvas
  const canvas = document.querySelector('#example-output')
  canvas.width = 960
  canvas.height = 540
  // create a new timeline bound to the canvas' context
  const timeline = new Trace.Timeline(canvas.getContext('2d'))
  // create a new viewport and add it to the timeline
  const viewport = new Trace.Viewport()
  timeline.addChild(viewport)
  // canvas size
  viewport.canvasWidth = canvas.width
  viewport.canvasHeight = canvas.height
  // viewport size
  viewport.width = 960
  viewport.height = 540
  // create a new circle
  const circle = new Circle()
  viewport.addChild(circle)
  // center
  circle.addKeys({
    transform: {
      translateX: 960 / 2,
      translateY: 540 / 2
    }
  })
  // animate expanding and changing color
  circle.addKeys({
    radius: {
      // seconds, value, easing, [easing parameters]
      0: 0,
      1: [200, Trace.Easing.easeOutExpo]
    },
    color: {
      0: '#fff',
      1: '#f00'
    }
  })

  // start drawing
  // ONLY WHEN NEEDED
  timeline.duration = 1
  timeline.on('timeupdate', () => {
    if (timeline.currentTime >= timeline.duration) timeline.stop()
  })

  // play animation
  // WHEN it's fully visible
  let play = function () {
    timeline.run()
    timeline.currentTime = 0
    timeline.play()
  }

  let didPlay = false
  window.addEventListener('scroll', () => {
    const rect = canvas.getBoundingClientRect()
    if (rect.bottom < window.innerHeight && !didPlay) {
      didPlay = true
      play()
    } else if (rect.top > window.innerHeight) {
      timeline.pause()
      timeline.currentTime = 0
      didPlay = false
      timeline.stop()
      timeline.draw(timeline.ctx, [1, 0, 0, 0, 1, 0, 0, 0, 1], 0, 0)
    }
  }, true)
}
