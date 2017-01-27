# AnimatedValue
An animated value. This class shouldn't be used directly.

## Properties
### `defaultValue`
**Default**: `null`

The default value, used if no `keys` are specified.

### `keys`
**Default**: `new Map()`

An object containing `time: [value, easing]` pairs.

The `easing` property must be an object containing the following items:

- `function` Function - Should map the first argument (`0 <= x <= 1`) to any finite number (0 for start, 1 for end)
- `parameters` Array - Additional parameters to be passed to the function

### `interpolator`
**Default**: Function that returns the default value

Signature: `interpolator(currentTime, keys, deltaTime, interpolatorSettings)`

- `currentTime` Number
- `keys` Map
- `deltaTime` Number
- `interpolatorSettings`: `this`

Returns the value.

A function used for interpolating the key values.

### `interpolatorSettings`
Utility.

## Methods
### `getValue(currentTime, deltaTime)`
- `currentTime` Number
- `deltaTime` Number - set to zero to prevent affecting real-time interpolators

Returns the value at the given time.

## Static Methods
### `applyInterpolator(instance, currentTime, deltaTime)`
- `instance` AnimatedNumber
- `currentTime` Number
- `deltaTime` Number

See above.

### `resolveKey(keys, time, defaultValue)`
- `keys` Map
- `time` Number - Key for `keys` in which the key is specified
- `defaultValue` - Default value, in case no value can be found

Returns the key's value if `keys` yields one, though if the value is `AnimatedValue.PREV_KEY` the previous key's, or the default value.

## Static Properties
### `PREV_KEY`
Tells the interpolator to use the previous key's value instead.
