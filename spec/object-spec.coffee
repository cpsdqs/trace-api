TraceObject = require('..').Object
glMatrix = require 'gl-matrix'

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

  describe 'draw', ->
    it 'should call drawChildren and drawSelf with time and delta time', ->
      object = new TraceObject

      dcSpy = spyOn object, 'drawChildren'
      dsSpy = spyOn object, 'drawSelf'

      ctx = {} # dummy

      object.draw ctx, glMatrix.mat4.create(), 2, 3

      expect(dcSpy).toHaveBeenCalled()
      expect(dsSpy).toHaveBeenCalled()
      expect(dcSpy.calls.mostRecent().args[0]).toBe ctx
      expect(dcSpy.calls.mostRecent().args[2]).toBe 2
      expect(dcSpy.calls.mostRecent().args[3]).toBe 3
      expect(dsSpy.calls.mostRecent().args[0]).toBe ctx
      expect(dsSpy.calls.mostRecent().args[2]).toBe 2
      expect(dsSpy.calls.mostRecent().args[3]).toBe 3

    it 'should .transform.getMatrix with the correct time', ->
      object = new TraceObject

      transformSpy = spyOn(object.transform, 'getMatrix').and.callThrough()

      object.draw {}, glMatrix.mat4.create(), 5, 1

      expect(transformSpy).toHaveBeenCalled()
      expect(transformSpy.calls.mostRecent().args[0]).toBe 5
      expect(transformSpy.calls.mostRecent().args[1]).toBe 1

    it 'should apply the object transform', ->
      object = new TraceObject

      ctx = {} # dummy

      parent = glMatrix.mat4.create()

      # do some random transformations
      for [0...10]
        switch Math.floor 3 * Math.random()
          when 0
            glMatrix.mat4.rotateX parent, parent, Math.random() * 2 * Math.PI
          when 1
            glMatrix.mat4.translate parent, parent, [Math.random(), 4, 1]
          when 2
            glMatrix.mat4.scale parent, parent, [2, Math.random(), 1]

      # now override the object's transform with random transformations
      child = glMatrix.mat4.create()
      object.transform.getMatrix -> child

      for [0...10]
        switch Math.floor 3 * Math.random()
          when 0
            glMatrix.mat4.rotateX parent, parent, Math.random() * 2 * Math.PI
          when 1
            glMatrix.mat4.translate parent, parent, [Math.random(), -2, 1]
          when 2
            glMatrix.mat4.scale parent, parent, [1, Math.random(), 3]

      # spy on drawSelf to get the actual matrix
      drawSpy = spyOn object, 'drawSelf'

      # now call draw
      object.draw {}, parent, 0, 0

      expect(drawSpy).toHaveBeenCalled()

      # multiply parent and child matrix
      multiplied = glMatrix.mat4.create()
      glMatrix.mat4.multiply multiplied, parent, child

      expect(drawSpy.calls.mostRecent().args[1]).toEqual multiplied

  describe 'drawChildren', ->
    # dummy ctx
    ctx = new Proxy {}, {
      get: (target, name) ->
        return -> # in case a function needs to be called
    }

    it 'should call .draw on all children', ->
      parent = new TraceObject
      children = (new TraceObject for [0...10])
      parent.addChild child for child in children

      transform = glMatrix.mat4.create()

      drawCalls = 0
      for child in children
        child.draw = (c, trf, t, dt) ->
          drawCalls++
          expect(c).toBe ctx
          expect(trf).toEqual transform
          expect(t).toBe 5
          expect(dt).toBe 3

      parent.drawChildren ctx, transform, 5, 3

      expect(drawCalls).toBe 10

    it 'should not draw disabled children', ->
      parent = new TraceObject
      child = new TraceObject
      child.enabled.addKey 0, false
      parent.addChild child

      drawSpy = spyOn child, 'draw'
      parent.drawChildren ctx, glMatrix.mat4.create(), 0, 0
      expect(drawSpy).not.toHaveBeenCalled()

    it 'should sort the children correctly', ->
      # not checking if it calls .sortChildren

      object = new TraceObject
      below = new TraceObject
      above = new TraceObject

      # add in reverse order
      object.addChild above
      object.addChild below

      above.zIndex.defaultValue = 1

      drawn = []
      below.draw = above.draw = -> drawn.push this

      object.drawChildren ctx, glMatrix.mat4.create(), 0, 0

      expect(drawn[0]).toBe below
      expect(drawn[1]).toBe above
