# Object
_Not the Javascript `Object`_

A basic object.

## Properties
An `Object` instance has the following properties:

### `transform`
**Default**: 3x3 identity matrix

A [`Transform`](transform.md) instance.

### `opacity`
**Default**: `1`

An [`AnimatedNumber`](animated-number.md) instance.

### `enabled`
**Default**: `true`

An [`AnimatedBoolean`](animated-boolean.md) instance. This object will be skipped by `drawChildren` if false.

### `parentNode`
**Default**: `null`

An `Object` or `null`. This variable should not be set manually.

### `children`
**Default**: `new Set()`

Child nodes of this object.

## Methods
### `draw(ctx, parentTransform, currentTime, deltaTime)`
- `ctx` CanvasRenderingContext2D
- `parentTransform` Matrix3
- `currentTime` Number
- `deltaTime` Number

Draws itself and its children.

### `drawSelf(ctx, transform, currentTime, deltaTime)`
- `ctx` CanvasRenderingContext2D
- `transform` Matrix3
- `currentTime` Number
- `deltaTime` Number

### `drawChildren(ctx, transform, currentTime, deltaTime)`
- `ctx` CanvasRenderingContext2D
- `transform` Matrix3 - The matrix the child nodes will receive as `parentTransform`
- `currentTime` Number
- `deltaTime` Number

Sorts children by zIndex and draws them.

### `addChild(childNode)`
- `childNode` Object

Adds a child node.

### `removeChild(childNode)`
- `childNode` Object

Removes a child node, if present.

### `hasChild(childNode)`
- `childNode` Object

Returns true if child node is present.

### `closest(fn)`
- `fn` Function - Should return `true` if criteria are met

Returns the first parentNode (or itself) that meets the criteria, or `null`.

### `addKeys(keys)`
- `keys` Object - Explained below

Shorthand for doing `someAnimatedValue.addKey` a bunch of times.

`keys` should consist of an `Object<property,Object<time,value>>`. Properties will always reference the object itself. They can either be specified by using `path.to.property.nested.somewhere.in.an.object` or just nesting them (as long as they don't look like a number). The value can be an array of `[value, easing, easingParameters]` instead, too.

## Events
### `connected`
Emitted when this object or one of its parents was added to a parent node.

### `disconnected`
The same, but for being removed.
