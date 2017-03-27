# Subcontext
**extends [`Object`](../api/object.md)**

Draws its children onto a canvas.

The constructor should have two arguments: `width` and `height`. Optionally, it can have `canvas` and `image` for use as a canvas for drawing and image buffer, respectively. By default, this will use `document.createElement('canvas')` and `window.Image`.

## Properties
### `width`, `height`
**Default**: Constructor arguments

### `originX`, `originY`
**Default**: `AnimatedNumber`

Where to put the origin within the canvas. Default to `(0, 0)`.

### `subTransform`
**Default**: `null`

Will override originX and originY if not `null`. Should implement a `getMatrix()` function that returns a 4&times;4 matrix.

### `inheritScale`
**Default**: `true`

Whether or not the canvas size should be scaled such that pixels map one to one.

### `alwaysRedraw`
**Default**: `true`

Whether or not the canvas should redraw every time, or only if the currentTime changes.

### `scaleX`, `scaleY`
**Default**: `1`

The factor by which the canvas size will be scaled. Will be set automatically if `inheritScale` is true.

### `anchorX`, `anchorY`
**Default**: `AnimatedNumber`

Where to put the top left corner of the canvas when drawing its image data. Default to `(0, 0)`. (Positive values will move it into the canvas and vice versa)

### `canvas`
The actual canvas element. Shouldn't be set manually.

### `subctx`
The canvas rendering context. Shouldn't be set manually either.

### `buffer`
The canvas' image data. Shouldn't be set manually.

### `filter`
**Default**: `function () {}`

A function called each frame with the arguments `(subctx, subTransform, currentTime, deltaTime)`. Intended to be used for modifying the `subctx`'s image data.

### `realWidth`, `realHeight`
The actual width and height (i.e. width and height multiplied by scaleX and scaleY).
