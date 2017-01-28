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
    this.skewZ = new AnimatedNumber(0)
    this.scaleX = new AnimatedNumber(1)
    this.scaleY = new AnimatedNumber(1)
    this.scaleZ = new AnimatedNumber(1)
  }

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
    const skewZ = this.skewZ.getValue(currentTime, deltaTime)
    const scaleX = this.scaleX.getValue(currentTime, deltaTime)
    const scaleY = this.scaleY.getValue(currentTime, deltaTime)
    const scaleZ = this.scaleZ.getValue(currentTime, deltaTime)

    glMatrix.mat4.translate(matrix, matrix, [translateX, translateY, translateZ])
    glMatrix.mat4.rotate(matrix, matrix, rotateX, [1, 0, 0])
    glMatrix.mat4.rotate(matrix, matrix, rotateY, [0, 1, 0])
    glMatrix.mat4.rotate(matrix, matrix, rotateZ, [0, 0, 1])
    glMatrix.mat4.scale(matrix, matrix, [scaleX, scaleY, scaleZ])

    // const skewMatrix = glMatrix.mat3.fromValues(1, skewY, 0, skewX, 1, 0, 0, 0, 1)

    // <dark-magic>
    const skewMatrix = glMatrix.mat4.fromValues(
      1, skewY, skewZ, 0,
      skewX, 1, skewZ, 0,
      skewX, skewY, 1, 0,
      0, 0, 0, 1
    )
    // </dark-magic>

    glMatrix.mat4.multiply(matrix, matrix, skewMatrix)

    return matrix
  }
}
