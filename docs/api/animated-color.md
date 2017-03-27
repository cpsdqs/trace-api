# AnimatedColor
**extends [`AnimatedValue`](animated-value.md)**

An animated color.

## Properties
### `interpolator`
Default: `AnimatedColor.interpolator`

## Static Methods
### `interpolator({ currentTime, keys, defaultValue, deltaTime, settings })`
Returns `String`: formatted as `rgb(r, g, b)` or `rgba(r, g, b, a)`

Uses the easing functions of the next key in `keys` to interpolate from the previous to the next key.

#### Interpolator Settings
- `model`: which model to use to interpolate. Default is `rgb`, options are as specified by [`color`](https://npmjs.com/package/color).
- `type`: return value type.
  - `'array'`: will return an rgb or rgba array
  - `'number'`: will return a number (which, when converted to hex, is the color)
  - anything else (or not set): will return a string as specified above
