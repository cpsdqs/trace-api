# ClippedText
**extends [`Object`](../api/object.md)**

Displays text.

## Properties
### `text`
**Default**: `AnimatedString('')`

The text content.

### `clip`
**Default**: `AnimatedNumber(0)`

How much of the text to clip.

| Value | Description   |
|-------|:--------------|
|  -1   | Clip to left  |
|   0   | No clipping   |
|   1   | Clip to right |

### `skew`
**Default**: `AnimatedNumber(0)`

How much to skewX the clipping mask (in radians).

### `family`
**Default**: `AnimatedString('sans-serif')`

The font family.

### `weight`
**Default**: `AnimatedNumber(400)`

The font weight.

### `size`
**Default**: `AnimatedNumber(16)`

The font size.

### `color`
**Default**: `AnimatedColor('#000')`

The text color.

### `align`
**Default**: `AnimatedString('center')`

Horizontal text align.

Values:
- `left`
- `center`
- `right`

### `baseline`
**Default**: `AnimatedString('middle')`

Vertical text align.

Values:
- `top`
- `middle`
- `bottom`

### `compensation`
**Default**: `AnimatedNumber(0)`

How much to readjust the position of the clip result; `0` for none at all, `1` to center.
