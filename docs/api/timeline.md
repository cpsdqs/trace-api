# Timeline
**extends [`Object`](object.md)**

Controls playback.

Note that this class can be added as a child and may inherit `currentTime` from the parent if the parent's `drawChildren` is called.

### `constructor(ctx)`
- `ctx` CanvasRenderingContext2D (optional)

## Properties
### `currentTime`
**Default**: `0`

A `Number`: the current time.

### `playbackRate`
**Default**: `1`

A `Number`: the playback rate.

### `duration`
**Default**: `0`

A `Number`: the duration.

### `paused`
**Default**: `true`

A `Boolean`. True if paused.

### `running`
**Default**: `false`

A `Boolean`. True if running.

### `loop`
**Default**: `false`

A `Boolean`. True if looping is enabled.

### `ctx`
**Default**: `null`

The canvas rendering context.

### `timeoutFunction`
**Default**: `requestAnimationFrame` or `setTimeout(..., 16.7)`

A function called to schedule the next frame.

### `lastLoopTime`
**Default**: `0`

When the draw method was last called. (Result of `Date.now()`)

### `markers`
**Default**: `new Map()`

A `Map<time, value>` specifying marker type at the specified time. If the value is `0`, the playback will stop when the marker is passed.

## Methods
### `play()`
Returns true if state was changed.

Starts playing.

### `pause()`
Returns true if state was changed.

Pauses playback.

### `run()`
Returns true if state was changed.

Starts the draw loop.

### `stop()`
Returns true if state was changed.

Stops the draw loop.

### `drawLoop()`
Recursive draw loop. Should not be called directly.

### `drawCurrent(dt)`
- `dt` Number - Value to be passed for delta time (Default: `0`)

Draws the current frame without starting the draw loop.

## Events
### `timeupdate`
Emitted when the current time changes (due to the draw loop), before drawing.

### `loopend`
Emitted at the end of each draw loop (after drawing).

### `end`
Emitted when playback ends.

### `play`, `pause`, `run`, `stop`
Emitted when the respective methods are called.
