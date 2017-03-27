TraceObject = require('..').Object

toArray = (iterator) ->
  result = []
  while (next = iterator.next()) and not next.done
    result.push next.value
  result

describe 'Object', ->
  describe 'constructor', ->
    it 'should construct', ->
      _ = new TraceObject

    it 'should have all properties', ->
      object = new TraceObject
      expect(object.parentNode).toBeDefined()
      expect(object.transform).toBeDefined()
      expect(object.opacity).toBeDefined()
      expect(object.enabled).toBeDefined()
      expect(object.zIndex).toBeDefined()
      expect(object.children).toBeDefined()

  describe 'addChild', ->
    it 'should add the node to .children', ->
      parent = new TraceObject
      child = new TraceObject
      parent.addChild child
      expect(toArray parent.children.values()).toContain child

    it 'should add all arguments to .children', ->
      parent = new TraceObject
      children = (new TraceObject for [0...15])
      parent.addChild children...
      for child in children
        expect(toArray parent.children.values()).toContain child

    it 'should throw if a child has a parent node', ->
      parent = new TraceObject
      child = new TraceObject
      realMom = new TraceObject
      realMom.addChild child

      expect ->
        parent.addChild child
      .toThrow()

    it "should set the child's parent node", ->
      parent = new TraceObject
      child = new TraceObject
      parent.addChild child
      expect(child.parentNode).toBe parent

    it 'should emit `connected` on the child', ->
      parent = new TraceObject
      child = new TraceObject
      fired = no
      child.on 'connected', ->
        fired = yes
      parent.addChild child
      expect(fired).toBe yes

  describe 'removeChild', ->
    it 'should remove the child from .children', ->
      parent = new TraceObject
      child = new TraceObject
      parent.addChild child
      parent.removeChild child
      expect(toArray parent.children.values()).not.toContain child

    it 'should remove all arguments from .children', ->
      parent = new TraceObject
      children = (new TraceObject for [0...15])
      parent.addChild children...
      parent.removeChild children...
      for child in children
        expect(toArray parent.children.values()).not.toContain child

    it 'should reset the .parentNode of the child', ->
      parent = new TraceObject
      child = new TraceObject
      parent.addChild child
      parent.removeChild child
      expect(child.parentNode).toBeFalsy()

    it 'should throw if a child is not in .children', ->
      parent = new TraceObject
      child = new TraceObject

      expect ->
        parent.removeChild child
      .toThrow()

  describe 'hasChild', ->
    it 'should return whether or not a child is present', ->
      parent = new TraceObject
      child = new TraceObject

      expect(parent.hasChild child).toBe no
      parent.addChild child
      expect(parent.hasChild child).toBe yes

  describe 'closest', ->
    it 'should find the closest object in the chain', ->
      target = new TraceObject
      target.isTarget = yes

      # add a bunch of parent nodes
      lastParent = target
      for [0...10]
        parent = new TraceObject
        lastParent.addChild parent
        lastParent = parent

      child = new TraceObject
      lastParent.addChild child

      expect(child.closest (o) -> o.isTarget).toBe target

    it 'should return null if nothing was found', ->
      object = new TraceObject
      expect(object.closest ->).toBe null

  describe 'addKeys', ->
    it 'should call addKey on all specified properties', ->
      object = new TraceObject

      calledA = no
      object.examplePropertyA =
        addKey: (time, key) ->
          calledA = yes
          expect(time).toBe 12
          expect(key).toBe 'key'

      calledB = no
      symbol = Symbol()
      object.examplePropertyB =
        addKey: (time, key) ->
          calledB = yes
          expect(time).toBe 1.5
          expect(key).toBe symbol

      object.addKeys
        examplePropertyA:
          12: 'key'
        examplePropertyB:
          1.5: symbol

      expect(calledA).toBe yes
      expect(calledB).toBe yes

    it 'should call addKey with the specified arguments', ->
      object = new TraceObject

      called = no
      ease = -> 0
      parameters = []
      object.exampleProperty =
        addKey: (time, key, easing, params) ->
          called = yes
          expect(time).toBe 12
          expect(key).toBe 'key'
          expect(easing).toBe ease
          expect(params).toBe parameters

      object.addKeys
        exampleProperty:
          12: ['key', ease, parameters]

      expect(called).toBe yes

    it 'should add keys to nested properties', ->
      object = new TraceObject

      called = no
      object.a =
        b:
          addKey: (time, key) ->
            called = yes
            expect(time).toBe 5
            expect(key).toBe 'key!'

      object.addKeys
        a:
          b:
            5: 'key!'

      expect(called).toBe yes

    it 'should allow negative time', ->
      object = new TraceObject

      called = no
      object.someProperty =
        addKey: (time) ->
          called = yes
          expect(time).toBe -2

      object.addKeys
        someProperty:
          '-2': 0

      expect(called).toBe yes

    it 'should not throw (but warn) if the property does not exist', ->
      object = new TraceObject

      consoleSpy = spyOn console, 'warn'
      object.addKeys
        someProperty:
          5: 3

      expect(consoleSpy.calls.count()).toBe 1

    it 'should not throw (but warn) if the property does not have .addKey', ->
      object = new TraceObject

      object.someProperty = {}

      consoleSpy = spyOn console, 'warn'
      object.addKeys
        someProperty:
          5: 3

      expect(consoleSpy.calls.count()).toBe 1

    it 'should set .defaultValue if the value is not an object', ->
      object = new TraceObject

      object.someProperty = {}
      object.addKeys
        someProperty: 3

      expect(object.someProperty.defaultValue).toBe 3

  describe 'sortChildren', ->
    it 'should get .zIndex and .enabled of all children', ->
      object = new TraceObject

      children = (new TraceObject for [0...10])
      object.addChild child for child in children

      calledZIndex = 0
      calledEnabled = 0
      for child in children
        child.zIndex =
          getValue: (t, dt) ->
            calledZIndex++
            expect(t).toBe 8
            expect(dt).toBe 2
        child.enabled =
          getValue: (t, dt) ->
            calledEnabled++
            expect(t).toBe 8
            expect(dt).toBe 2

      object.sortChildren 8, 2

      expect(calledZIndex).toBe 10
      expect(calledEnabled).toBe 10

    it 'should put the values of .zIndex and .enabled in .values', ->
      object = new TraceObject
      children = (new TraceObject for [0...10])
      object.addChild child for child in children

      { values } = object.sortChildren 0, 0

      expect(values.size).toBe 10

      for key in toArray(values.keys())
        expect(children).toContain key

        # default values
        expect(values.get(key)[0]).toBe 0
        expect(values.get(key)[1]).toBe true

    it 'should sort them by z-index', ->
      object = new TraceObject
      below = new TraceObject
      above = new TraceObject

      # add in reverse order
      object.addChild above
      object.addChild below

      above.zIndex.defaultValue = 1

      { children } = object.sortChildren 0, 0

      expect(children[0]).toBe below
      expect(children[1]).toBe above

    it 'should keep the order if there is nothing to do', ->
      object = new TraceObject

      children = (new TraceObject for [0...10])
      object.addChild child for child in children

      { values, children: sortedChildren } = object.sortChildren 0, 0

      for child, i in sortedChildren
        expect(child).toBe children[i]

  # TODO: draw, drawChildren, but not drawSelf
