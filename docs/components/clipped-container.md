# ClippedContainer
**extends [`Object`](../api/object.md)**

Draws its children inside a clipping mask.

## Properties
### `clip`
**Default**: `function () {}`

Put code here to clip, e.g.:

```javascript
clippedContainer.clip = function (ctx, transform, currentTime, deltaTime) {
  Trace.Utils.setTransformMatrix(ctx, transform)

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(100, 100)
  // ...
  ctx.clip()
}
```
