# 0.3.0
- (**BREAK**) changed `curAnim`, `width` and `height` by `sprite()` are changed to methods `curAnim()`, `width()` and `height()`
- (**BREAK**) removed `velY`, `curPlatform` and `maxVel` fields by `body()`

# 0.2.0
- (**BREAK**) removed `aseSpriteSheet` conf field from `loadSprite(name, src, conf)`
- added `loadAseprite(name, imgSrc, jsonSrc)`
- added `pause()`, `resume()`, `stop()`, `loop()`, `unloop()`, `volume()`, `detune()`, `speed()` methods to the handle returned by `play()`
- added area component generation for `text()`
- added `noArea` to conf field of `sprite()`, `rect()` and `text()`, allowing to disable auto area component generation
- added a `quad` field to sprite comp creation config `sprite(id, { quad: quad(0, 0, 0.5, 0.5) })`
- fixed `resolve()` not working if the obj also has `solid`, so it does not check for itself
- `mousePos()` accepts a layer argument, which returns the mouse position affected by camera transform if that layer is not `camIgnore()`-ed
- fixed camera position getting calculated before completing every object's update
- added `camShake()` for built in camera shake
- fixed some cases `on("grounded", f)` called multiple times when moving on a smooth platform
- added `revery()` to iterate objects in reverse order
- added `readd()` to re-add an object to the scene without triggering events
- added `level.spawn()`

# 0.1.0
- (**BREAK**) changed default origin point to `"topleft"`, so if you want object origin point to be at center you'll need to manual `origin("center")`
- (**BREAK**) integrated `kit/physics` and `kit/level` to main lib
- (**BREAK**) makes `collides()` only run on first collision, not run every frame during the same collision
- (**BREAK**) `camPos()` by default focuses to center, so `camPos(player.pos)` puts player in the center of the screen
- (**BREAK**) renamed `kaboom.import()` to `kaboom.global()`
- added an arg field to `start(scene, ...)` to forward args to start scene
- added `camScale()`, `camRot()` and `camIgnore()`
- added `obj.overlaps()` by `area()`, and `overlaps()`
- added 3 ext fonts under `ext/fonts`
