AnimatedValue = require('..').AnimatedValue

describe 'AnimatedValue', ->
  describe 'constructor', ->
    it 'should construct', ->
      _ = new AnimatedValue

    it 'should set the default value', ->
      defaultValue = Math.random()
      animatedValue = new AnimatedValue defaultValue
      expect(animatedValue.defaultValue).toBe defaultValue

  describe 'getValue', ->
    it 'should call the interpolator with correct arguments', ->
      animatedValue = new AnimatedValue
      time = Math.random()
      deltaTime = Math.random()
      animatedValue.interpolator = ({
        currentTime: t, keys, defaultValue, deltaTime: dt, settings
      }) ->
        expect(t).toBe time
        expect(keys).toBe animatedValue.keys
        expect(defaultValue).toBe animatedValue.defaultValue
        expect(dt).toBe deltaTime
        expect(settings).toBe animatedValue.interpolatorSettings

      animatedValue.getValue time, deltaTime

  describe 'addKey', ->
    it 'should add a key as specified', ->
      animatedValue = new AnimatedValue
      time = Math.random()
      value = Math.random()
      easingValue = Math.random()
      easing = -> easingValue
      parameters = [Math.random()]

      animatedValue.addKey time, value, easing, parameters

      key = animatedValue.keys.get time

      # check time
      expect(key).toBeDefined()

      # check value
      expect(key[0]).toBe value

      # check easing and parameters
      expect(key[1].function).toBe easing
      expect(key[1].parameters).toBe parameters

  describe 'removeKey', ->
    it 'should remove the key', ->
      animatedValue = new AnimatedValue
      animatedValue.addKey 5, 0
      animatedValue.removeKey 5

      expect(animatedValue.keys.get 5).toBeUndefined()

  describe 'resolveKey', ->
    it 'should return the key at the specified time', ->
      animatedValue = new AnimatedValue
      animatedValue.addKey 5, 1
      resolved = AnimatedValue.resolveKey animatedValue.keys, 5, 0
      expect(resolved).toBe animatedValue.keys.get 5

    it 'should return the previous key if set to PREV_KEY', ->
      animatedValue = new AnimatedValue
      animatedValue.addKey 4, 3
      animatedValue.addKey 5, AnimatedValue.PREV_KEY
      resolved = AnimatedValue.resolveKey animatedValue.keys, 5, 0
      expect(resolved).toBe animatedValue.keys.get 4

    it 'should return the default value if there is no PREV_KEY', ->
      animatedValue = new AnimatedValue
      animatedValue.addKey 5, AnimatedValue.PREV_KEY
      resolved = AnimatedValue.resolveKey animatedValue.keys, 5, 12
      expect(resolved[0]).toBe 12
