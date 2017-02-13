# Transform
Represents an object's transform.

## Properties
- `translateX`
- `translateY`
- `translateZ`
- `rotateX`
- `rotateY`
- `rotateZ`
- `skewX` (also `skewXY`)
- `skewY` (also `skewYX`)
- `skewZX`
- `skewZY`
- `skewXZ`
- `skewYZ`
- `scaleX`
- `scaleY`
- `scaleZ`

All properties are instances of [`AnimatedNumber`](animated-number.md) and have a default value of `0`, except for `scaleX/Y/Z` which have a default value of `1`.

Skew A B should be interpreted as the shear along the A axis in B, that is, a cube would be sheared such that the face located in the positive B direction would be moved along the A axis.

## Methods
### `getMatrix(currentTime, deltaTime)`
- `currentTime` Number
- `deltaTime` Number

Returns a 4x4 transformation matrix for the given time. Order is as specified by [`gl-matrix`](https://npmjs.com/package/gl-matrix).
