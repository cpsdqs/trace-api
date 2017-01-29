# AnimatedColor
**extends [`AnimatedValue`](animated-value.md)**

An animated color.

## Properties
### `interpolator`
Default: `AnimatedColor.interpolator`

## Static Methods
### `interpolator(currentTime, keys, defaultValue, deltaTime, interpolatorSettings)`
Returns `String`: formatted as `rgb(r, g, b)` or `rgba(r, g, b, a)`

Uses the easing functions of the next key in `keys` to interpolate from the previous to the next key.

`interpolatorSettings` can have a property `model` to specify which model to use to interpolate. Default is `rgb`, options are as specified by [`color`](https://npmjs.com/package/color).
