if (typeof window !== 'undefined' &&
    typeof window.CanvasRenderingContext2D.prototype.resetTransform !== 'function') {
  window.CanvasRenderingContext2D.prototype.resetTransform = function () {
    this.setTransform(1, 0, 0, 1, 0, 0)
  }
}
