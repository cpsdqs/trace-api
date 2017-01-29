const glMatrix = require('gl-matrix')
const AnimatedNumber = require('./animated-number')

module.exports = class Transform {
  constructor () {
    this.translateX = new AnimatedNumber(0)
    this.translateY = new AnimatedNumber(0)
    this.translateZ = new AnimatedNumber(0)
    this.rotateX = new AnimatedNumber(0)
    this.rotateY = new AnimatedNumber(0)
    this.rotateZ = new AnimatedNumber(0)
    this.skewX = new AnimatedNumber(0)
    this.skewY = new AnimatedNumber(0)
    this.skewZX = new AnimatedNumber(0)
    this.skewZY = new AnimatedNumber(0)
    this.skewXZ = new AnimatedNumber(0)
    this.skewYZ = new AnimatedNumber(0)
    this.scaleX = new AnimatedNumber(1)
    this.scaleY = new AnimatedNumber(1)
    this.scaleZ = new AnimatedNumber(1)
  }

  // aliases
  get skewXY () { return this.skewX }
  set skewXY (v) { this.skewX = v }
  get skewYX () { return this.skewY }
  set skewYX (v) { this.skewY = v }

  getMatrix (currentTime, deltaTime) {
    let matrix = glMatrix.mat4.create()

    const translateX = this.translateX.getValue(currentTime, deltaTime)
    const translateY = this.translateY.getValue(currentTime, deltaTime)
    const translateZ = this.translateZ.getValue(currentTime, deltaTime)
    const rotateX = this.rotateX.getValue(currentTime, deltaTime)
    const rotateY = this.rotateY.getValue(currentTime, deltaTime)
    const rotateZ = this.rotateZ.getValue(currentTime, deltaTime)
    const skewX = this.skewX.getValue(currentTime, deltaTime)
    const skewY = this.skewY.getValue(currentTime, deltaTime)
    const skewZX = this.skewZX.getValue(currentTime, deltaTime)
    const skewZY = this.skewZY.getValue(currentTime, deltaTime)
    const skewXZ = this.skewXZ.getValue(currentTime, deltaTime)
    const skewYZ = this.skewYZ.getValue(currentTime, deltaTime)
    const scaleX = this.scaleX.getValue(currentTime, deltaTime)
    const scaleY = this.scaleY.getValue(currentTime, deltaTime)
    const scaleZ = this.scaleZ.getValue(currentTime, deltaTime)

    glMatrix.mat4.translate(matrix, matrix, [translateX, translateY, translateZ])
    glMatrix.mat4.rotate(matrix, matrix, rotateX, [1, 0, 0])
    glMatrix.mat4.rotate(matrix, matrix, rotateY, [0, 1, 0])
    glMatrix.mat4.rotate(matrix, matrix, rotateZ, [0, 0, 1])
    glMatrix.mat4.scale(matrix, matrix, [scaleX, scaleY, scaleZ])

    // skewX: skewX as it works in 2D (technically skewXY)
    // skewY: skewY as it works in 2D (technically skewYX)
    // skewZX: skew along Z axis in positive X
    // skewZY: skew along Z axis in positive Y
    // skewXZ: skew along X axis in positive Z
    // skewYZ: skew along Y axis in positive Z

    const skewMatrix = glMatrix.mat4.fromValues(
      1, skewY, skewZX, 0,
      skewX, 1, skewZY, 0,
      skewXZ, skewYZ, 1, 0,
      0, 0, 0, 1
    )

    glMatrix.mat4.multiply(matrix, matrix, skewMatrix)

    return matrix
  }
}
