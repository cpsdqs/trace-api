# Object
_Not the Javascript `Object`_

A basic object.

## Properties
An `Object` instance has the following properties:

### `transform`
**Default**: `new Transform()`

The object's transform.

### `opacity`
**Default**: `AnimatedNumber(1)`

The object's opacity.

### `enabled`
**Default**: `AnimatedBoolean(true)`

This object will be skipped by `drawChildren` if this is set to false.

### `parentNode`
**Default**: `null`

The parent node. An `Object` instance or `null`. This variable should not be set manually.

### `children`
**Default**: `new Set()`

Child nodes of this object.

## Methods
### `draw(ctx, parentTransform, currentTime, deltaTime)`
- `ctx` CanvasRenderingContext2D
- `parentTransform` Matrix4
- `currentTime` Number
- `deltaTime` Number

Draws itself and its children.

### `drawSelf(ctx, transform, currentTime, deltaTime)`
- `ctx` CanvasRenderingContext2D
- `transform` Matrix4
- `currentTime` Number
- `deltaTime` Number

### `drawChildren(ctx, transform, currentTime, deltaTime)`
- `ctx` CanvasRenderingContext2D
- `transform` Matrix4 - The matrix the child nodes will receive as `parentTransform`
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
