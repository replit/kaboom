### kaboom2000 (unreleased)
- version jumped to v2000.0.0 (still semver, just big)
- added `burp()` for easy burping
- added decent typescript support and jsdocs
- revamped visual style, changed default font and debug font
- introducing new character "bean"
![bean](sprites/bean.png)
- added `loadBean()` to `"bean"` as a default sprite
- added comp `health()` to manage health related logic
- added comp `move()` to manage projectile-like behavior
- added comp `outline()` to draw a lil outline
- added comp `timer()` to attach timers to a game obj
- added comp `fixed()` to make a game obj unaffected by camera
- added comp `stay()` to make a game obj stay after scene switch
- added comp `lifespan()` to destroy game obj after certain amount of time
- added comp `z()` to define draw order for objs on the same layer
- added `weight` to `BodyComp` and `BodyCompConf` to control the gravity multiplier
- added `djump()` to `BodyComp` for double jump
- added `dir()` to calculate directional vector from angle
- added constants `LEFT`, `RIGHT`, `UP`, `DOWN` for unit directional vector
- added `fullscreen()` to enable real fullscreen mode
- **BREAK** changed color from 0-1 range to 0-255, angles from radians to degrees
- `global` and `debug` flag now are enabled by default, need to turn off manually if you don't want
- added input events `touchStart(id, pos)`, `touchMove(id, pos)`, `touchEnd(id, pos)`, `mouseMove(pos)`
- added `font` field in `KaboomConf` to set the default font
- added `mouseDeltaPos()`
- added `touchToMouse` to control if touch events should be translated to mouse events
- added `mousePos()` now gets the screen mouse pos, use `mouseWorldPos()` to get the mouse position affected by camera
- added `anim` field in `SpriteCompConf` to play an anim on start
- beter type support for components
- `scene()` and `start()` (also removed in favor of `go()`) are optional now, if you don't need multiple scenes yet you can just go directly
```js
kaboom();
// no mandatory scene() to start kabooming
add(...);
keyPress(...);
```
- **BREAK** `area()` is now explicit and not automatically added by `sprite()`, `rect()`, and `text()`, removed each `noArea` or `area` config field
```js
add([
    sprite("bean"),
    area(), // empty area() will calc size from the sprite
]);
```
- **BREAK** `area()` now takes an `AreaCompConf`, where you can define the area points, size, scale, and hover cursor
- audio is now paused when you leave the tab
- audio is now paused on `debug.paused = true`
- added localStorage helper `getData(key, default?)` and `setData(key, data)`
- added `loadShader(id, vert, frag, isUrl)`
- **BREAK** changed last argument of `loadFont()` to `FontLoadConf`
- added `shader()` comp for attaching custom shader to an obj
- all event handlers like `keyPress()`, `mouseClick()`, `action()`, `collides()` now returns a function to cancel that listener
- added `require` on component definitions, making it possible to declare dependencies for components, e.g.
```js
function alwaysRight() {
    return {
        // the id of this component
        id: "alwaysRight",
        // list of component ids that this requires
        require: [ "pos", ],
        update() {
            // so you can use `move()` from pos() component with no worry
            this.move(100, 0);
        },
    };
}
```
- **BREAK** overlapping component fields are not allowed, e.g. you can have a custom comp that has a `collides` field if it already have a `area` component, since it already has that
- **BREAK** changed `text(txt, size, conf)` to `text(txt, conf)` with `size` as a field
- added `obj.c(id)` for getting a specific comp's state (by default all comps' states are mounted to the obj by `Object.defineProperty`)
```js
// both works
obj.play("anim");
obj.c("sprite").play("anim");
```
- pedit, aseprite, cga plugins are now included by default
- added `addKaboom()` for quick kaboom explosion
- `load*()` now accepts `null` as name and not load into assets manager, instead just return the resource data handle
- **BREAK** renamed event `headbump` to `headbutt`
- **BREAK** renamed event `grounded` to `ground`
- added `width`, `height`, and `tiled` attrib to `SpriteCompConf`, for better control over sprite size and tiled sprite support
- **BREAK** renamed `resolve()` to `pushOutAll()` on `area` comp
- added `pushOut()` for pushing a single object out from another with `area` comp
- fixed `"add"` event getting called twice for tagged objs
- added `flipX` and `flipY` on `sprite()` comp configuration, and `flipX()` `flipY()` methods
- added `moveTo(dest: Vec2, speed?: number)` to `pos()` comp
- added `keyPress()` (and all other key events) with no arg to check for any key
- **BREAK** renamed `camShake()` to `shake()`
- **BREAK** remove `flipX()` and `flipY()` on `scale()` comp
- **BREAK** removed `start()` in favor of `go()`
- **BREAK** removed `changeSprite()` in favor of `use(sprite("newsprite"))`
- **BREAK** renamed `rmTag()` to `untag()`
- **BREAK** removed `camIgnore()` in favor of `fixed()`
- **BREAK** renamed `makeRng()` to `rng()`

### v0.5.1
- added plugins npm package support e.g. `import asepritePlugin from "kaboom/plugins/aseprite"`

# v0.5.0 "Sticky Type"
- platforms are now sticky
- moved to TypeScript
- improved graphics performance
- improved inspect drawing performance
- added on-screen log that catches all kinds of errors
- added `cursor()`
- added `curPlatform()` by `body()`
- added `falling()` by `body()`
- added `changeSprite()` by `sprite()`
- added `duration()` and `time()` for the handle returned by `play()`
- added optional `seek` field to the audio play conf `play([conf])`
- added `LoopHandle` returned by `loop()` that has a `stop()`
- added a default background (can be dismissed by setting `clearColor`)
- fixed `sound.pause()` to work on firefox
- fixed collisions not treating explicit default layer the same as implicit default layer
- fixed unable to play another anim in `onAnimEnd()`
- fixed scene switches happen in the middle of a frame
- fixed `scale(0)` not working
- fixed `mosuePos()` not returning the camera affected pos with no layers
- **BREAK** changed `dbg()` to plain `debug` object
- **BREAK** moved `fps()`, `objCount()`, `stepFrame()`, `log()`, `error()` under `debug`
- **BREAK** removed `debug.logTime`
- **BREAK** changed component `debugInfo()` hook to `inspect()`
- **BREAK** removed `timer()` component
- **BREAK** renamed `removeTag()` to `rmTag()`
- **BREAK** changed `SpriteAnim` from `[ from, to ]` to `{ from: number, to: number }`
- **BREAK** removed `onAnimPlay()` and `onAnimEnd()` in favor of generic event `on("animEnd", (anim: string) => {})`
- **BREAK** removed `obj.addTag()` in favor of `obj.use()`
- **BREAK** merged `debug.hoverInfo` and `debug.showArea` into `debug.inspect`
- **BREAK** removed `sound.resume()` in favor of `sound.play()`

### v0.4.1
- fixed `on("destroy")` handler getting called twice
- fixed sprite `play()` not playing

# v0.4.0 "Multiboom"
- **BREAK** removed `init()` and `kaboom.global()`, in favor of `kaboom()`, also allows multiple kaboom games on one page
```js
// replaces init(), and added a 'global' flag for previous kaboom.global()
kaboom({
    global: true,
    width: 480,
    height: 480,
});
```
or not global
```js
const k = kaboom();
k.scene();
k.start();
k.vec2();
```
- **BREAK** changed `clearColor` on `kaboom(conf)` to accept a 4 number array instead of `rgba()`
- added a plugin system, see the `multiboom` example and `src/plugins`
- **BREAK** removed support for `.kbmsprite`, supports newer version of `.pedit` through pedit plugin
- **BREAK** `loadAseprite()` and made it an external plugin under `plugins/aseprite.js`
- added `sceneData()` for custom scene data kv store
- fixed `mouseClick` doesn't work on mobile
- disabled context menu on canvas
- prevented default behavior for 'tab' and function keys
- added `numFrames()` by `sprite()`
- added `screenshot()` that returns of a png base64 data url for a screenshot

# v0.3.0 "King Dedede...Bug!"
- **BREAK** removed `pause()` and `paused()` in favor to `kaboom.debug.paused`
- **BREAK** removed `velY`, `curPlatform` and `maxVel` fields by `body()`
- **BREAK** changed `curAnim` by `sprite()` to method `curAnim()`
- fixed `dt()` surge on page visibility change (#20)
- pause audio when page is not visible
- added built in debug control with `init({ debug: true, })`
  - `` ` ``: toggle `showLog` (default on with `debug: true`)
  - `f1`: toggle `showArea`
  - `f2`: toggle `hoverInfo`
  - `f8`: toggle `paused`
  - `f7`: decrease `timeScale`
  - `f9`: increase `timeScale`
  - `f10`: `stepFrame()`
- added on screen logging with `log()` and `error()`
- fixed `loadRoot()` sometimes doesn't work in async tasks

# v0.2.0 "Hear the Tremble"
- **BREAK** removed `aseSpriteSheet` conf field from `loadSprite(name, src, conf)`
- added `pause()`, `resume()`, `stop()`, `loop()`, `unloop()`, `volume()`, `detune()`, `speed()` methods to the handle returned by `play()`
- added `camShake()` for built in camera shake
- added `loadAseprite(name, imgSrc, jsonSrc)`
- added area component generation for `text()`
- added `noArea` to conf field of `sprite()`, `rect()` and `text()`, allowing to disable auto area component generation
- added a `quad` field to sprite comp creation config `sprite(id, { quad: quad(0, 0, 0.5, 0.5) })`
- fixed `resolve()` not working if the obj also has `solid`, so it does not check for itself (#8)
- `mousePos()` accepts a layer argument, which returns the mouse position affected by camera transform if that layer is not `camIgnore()`-ed
- fixed camera position getting calculated before completing every object's update (#14)
- fixed some cases `on("grounded", f)` called multiple times when moving on a smooth platform
- added `revery()` to iterate objects in reverse order
- added `readd()` to re-add an object to the scene without triggering events
- added `level.spawn()`

# v0.1.0 "Oh Hi Mark"
- **BREAK** changed default origin point to `"topleft"`, so if you want object origin point to be at center you'll need to manual `origin("center")`
- **BREAK** integrated `kit/physics` and `kit/level` to main lib
- **BREAK** makes `collides()` only run on first collision, not run every frame during the same collision
- **BREAK** `camPos()` by default focuses to center, so `camPos(player.pos)` puts player in the center of the screen
- **BREAK** renamed `kaboom.import()` to `kaboom.global()`
- added an arg field to `start(scene, ...)` to forward args to start scene
- added `camScale()`, `camRot()` and `camIgnore()`
- added `obj.overlaps()` by `area()`, and `overlaps()`
- added 3 ext fonts under `ext/fonts`
