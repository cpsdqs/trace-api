# AnimatedValue
**extends [`EventEmitter`](https://nodejs.org/api/events.html)**

An animated value.

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
**Default**: Step interpolator (returns the leftmost key)

Signature: `interpolator(options)`

- `options` Object
  - `currentTime` Number
  - `keys` Map
  - `deltaTime` Number
  - `settings`: Interpolator Settings
  - `defaultValue` Default Value

Returns the value.

A function used for interpolating the key values.

### `interpolatorSettings`
An object. Can contain anything and will be passed to the interpolator.

## Methods
### `getValue(currentTime, deltaTime)`
- `currentTime` Number
- `deltaTime` Number - set to zero to prevent affecting real-time interpolators

Returns the value at the given time. This emits `change`

### `addKey(time, value, easing, parameters)`
- `time` Number
- `value` Any
- `easing` Function - optional
- `parameters` Object - optional

Adds a key as specified.

### `removeKey(time)`
- `time` Number

Removes a key at `time` if it exists.

### `valuesAreEqual(a, b)`
- `a`, `b` Any - values to compare

Returns true if the values are not strictly equivalent.

## Events
### `change`
Emitted when the most recent value has changed. Whether or not two values are identical is determined by `valuesAreEqual`.

## Static Methods
### `applyInterpolator(instance, currentTime, deltaTime)`
- `instance` AnimatedValue
- `currentTime` Number
- `deltaTime` Number

See above. (Use `getValue` instead, unless implementing `getValue`)

### `resolveKey(keys, time, defaultValue)`
- `keys` Map
- `time` Number - Key for `keys` in which the key is specified
- `defaultValue` - Default value, in case no value can be found

Returns the key's value if `keys` yields one, though if the value is `AnimatedValue.PREV_KEY` the previous key's, or the default value.

## Static Properties
### `PREV_KEY`
Tells the interpolator to use the previous key's value instead.
