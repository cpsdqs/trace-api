# Changelog
## current
### Added
- `Subcontext`: `alwaysRedraw` option to only redraw children if current time changes when false
- Bezier function cache in `Easing`
- Specs (Jasmine) (`npm test`)
- Added `addChild(...children)` and `removeChild(...children)`
- `AnimatedValue` is now a subclass of `EventEmitter`
- `change` event when the most recent value of an `AnimatedValue` instance changes
- `AnimatedValue.valuesAreEqual` for checking if `change` should be fired
- Two optional arguments for the `Subcontext` constructor: `canvas` and `image`

### Changed
- begin-step interpolator is now in `AnimatedValue` and no longer in each subclass
- interpolator arguments are now in an object

### Fixed
- Bug where it would return the default value instead of a key with the default value with `PREV_KEY`
- Bug where `Object.removeChild` doesn't reset `.parentNode`

### Removed
- Relative time in addKeys
- Default `Object.drawSelf`
- `canvas` as an optional dependency (along with Canvas/ImageConstructor stuff in `Subcontext`)

## 0.1.0
### Added
- Everything
