# v2001.0.0 "A Kaboom Odyssey"

- (**BREAK**) removed all deprecated functions in v2000.2
- game objects can have children with `obj.add()` now which share the parent transform
- (**BREAK**) raised esbuild target to `esnext`
- added `make()` to make a game object without adding to the scene
- added support for `add()` to add unattached game objects to the scene `add(make([...comps]))`
- added `colors` option to `drawPolygon()` that controls the color of each corner
- added `gradient` option to `drawRect()` that specifies the start and end color
- added `loadProgress()` that returns a `0.0 - 1.0` that indicates current asset loading progress
- added `kaboom()` option `loadingScreen` where you can turn off the default loading screen
- added `drawMasked()` and `drawSubtracted()`
- (**BREAK**) removed `layers()` in favor of parent game objects (see "layers" demo)
- added `pushRotateX()`, `pushRotateY()` and `pushRotateZ()`
- added `pixelDensity` option to `kaboom()`
- added support for non bitmap fonts
- (**BREAK**) rename `loadFont()` to `loadBitmapFont()`
- added `loadFont()` to load `.ttf`, `.otf`, `.woff2` or any font supported by browser `FontFace`
- (**BREAK**) `origin` no longer controls text alignment, use `align` option instead
- added `quit()` to end everything
- shader error logs now yields the correct line number
- changed object update order from reversed to not reversed
- added `download()`, `downloadText()`, `downloadJSON()`, `downloadBlob()`
- added `Recording#stop()` to stop the recording and returns the video data as mp4 Blob
- added `debug.numFrames()` to get the total number of frames elapsed
- fixed visual artifacts on text
- added `onError()` to handle error or even custom error screen
- added `onLoading()` to register a custom loading screen (see "loader" example)
- fixed touches not treated as mouse
- (**BREAK**) changed `onTouchStart()`, `onTouchMove()` and `onTouchEnd()` callback signature to `(pos: Vec2, touch: Touch) => void` (exposes the native `Touch` object)

### v2000.2.6

- fixed text always being wrapped if updated
- fixed text comp properties `letterSpacing`, `charSpacing`, `transform`, `styles` not being exposed

### v2000.2.5

- fixed updating `font` property on gameobj not updating the text font

### v2000.2.4

- fixed `focus()` not properly exported
- deprecated `focus()` in favor of `canvas.focus()` due to name collision

### v2000.2.3

- fixed `kaboom.d.ts` completely messed up

### v2000.2.2

- fixed doc for `TextCompOpt#styles` and `DrawTextOpt#styles`

### v2000.2.1

- fixed updates not running at all when `kaboom({ debug: false })`

## v2000.2.0 "Fancy Text Mode"

- added `formatText()` and `drawFormattedText()`
- added `charSpacing` and `lineSpacing` in `TextCompOpt` and `DrawTextOpt`
- added optional `transitions` argument in `state()` to define allowed transitions
- added `StateComp#onStateTransition` to register event for specific transitions
- added syntax to style a piece of text `"this is a [styled].wavy text"` and `style` option in `TextCompOpt` and `DrawTextOpt` to define the styles with `CharTransformFunc`
- deprecated `dir()` in favor of `Vec2.fromAngle()`
- fixed `onTouchEnd()` fired on `touchmove`
- added `outview()` component to control behavior when object leaves visible area
- deprecated `cleanup(delay?: number)` in favor of `cleanup(opt?: CleanupOpt)`
- deprecated `mouseWorldPos()` in favor of `toWorld(mousePos())`
- deprecated `rng()` in favor of `new RNG()`
- added classes `Vec2`, `Color`, `Mat4`, `Timer`, `Quad`, `RNG`, `Line`, `Rect`, `Circle`
- added deprecation warning
- fixed letterbox view mode
- allow non-stretch letterbox
- fixed mouse position malfunction in fullscreen, stretch and letterbox mode

### v2000.1.8

- fixed `Color#eq()` not giving correct result

### v2000.1.7

- fixed not having export if installed from github repo with npm
- fixed event canceller returned by raw `onUpdate()` and `onDraw()` crashing

### v2000.1.6

- fixed debug widget scale

### v2000.1.5

- fixed `enterState()` not passing args to `onStateEnter()` callback

### v2000.1.4

- fixed `state()` to not require registering `onStateUpdate()` before using any state

### v2000.1.2

- fixed `onKeyRelease()` wrongfully check for key press instead of release

### v2000.1.1

- fixed `StateComp#enterState()` not accepting any state

## v2000.1.0 "Record Mode"

- added `hsl2rgb()` for converting HSL color to kaboom RGB
- added `record()` to start a screen recording
- added F5 to screenshot and F6 to toggle record mode in debug mode
- added `DrawTextOpt#transform()` and `TextCompOpt#transform()` for defining style and transformation for each character
- added `state()` component for finite state machine
- added support for multiple tags in `get()` and `every()`
- added UI indicator for `debug.paused` and `debug.timeScale`
- changed inspect mode UI style
- added color constants `WHITE`, `BLACK`, `BLUE`, `GREEN`, `RED`, `MAGENTA`, `CYAN`, `YELLOW`
- added new API style (`on` prefix for all event handler function, `is` prefix for all boolean state getters)
  - `onLoad()`
  - `onUpdate()`
  - `onDraw()`
  - `onKeyPress()`
  - `onKeyPressRepeat()`
  - `onKeyDown()`
  - `onKeyRelease()`
  - `onMousePress()`
  - `onMouseDown()`
  - `onMouseRelease()`
  - `onMoueMove()`
  - `onTouchStart()`
  - `onTouchMove()`
  - `onTouchEnd()`
  - `onCollide()`
  - `onClick()`
  - `onHover()`
  - `isFocused()`
  - `isKeyDown()`
  - `isKeyPressed()`
  - `isKeyPressedRepeat()`
  - `isKeyDown()`
  - `isMouseDown()`
  - `isMousePressed()`
  - `isMouseReleased()`
  - `isMouseMoved()`
  - `isMouseMoved()`
  - `GameObj#onUpdate()`
  - `GameObj#onDraw()`
  - `AreaComp#onCollide()`
  - `AreaComp#onHover()`
  - `AreaComp#onClick()`
  - `BodyComp#onGround()`
  - `BodyComp#onFall()`
  - `BodyComp#onHeadbutt()`
  - `BodyComp#onDoubleJump()`
  - `BodyComp#isGrounded()`
  - `BodyComp#isFalling()`
  - `SpriteComp#onAnimEnd()`
  - `SpriteComp#onAnimStart()`
  - `HealthComp#onDeath()`
  - `HealthComp#onHurt()`
  - `HealthComp#onHeal()`
  - `AudioPlay#isStopped()`
  - `AudioPlay#isPaused()`

# v2000.0.0 "Burp Mode"
- version jumped to v2000.0.0 (still semver, just big)
- added `burp()` for easy burping
- added decent typescript / autocomplete support and jsdocs
- introducing new character "bean"
![bean](assets/sprites/bean.png)
- added `loadBean()` to load `"bean"` as a default sprite
- changed default font to [APL386](https://abrudz.github.io/APL386/), as `"apl386o"` (default outlined version) and `"apl386"`
- included font [kitchen sink](https://polyducks.itch.io/kitchen-sink-textmode-font) as `"sinko"` (outlined version) and `"sink"` (standard version with extended characters for text-mode games)
- added `font` field in `KaboomOpt` to set the default font
- added `loadSpriteAtlas(src, entries)` to load sprite atlas
- inspect mode now displays every comp's state
- **BREAK** added continuous collision resolution which checks collision in `move()` if 2 objects are both "solid" (objects now won't pass through other solid object at high speed or low framerate)

```js
// before
add([
	sprite("player"),
	area(),
]);

add([
	sprite("rock"),
	solid(),
]);

keyDown("left", () => {
	player.move(-120, 0);
});

player.action(() => {
	player.resolve(); // or pushOutAll() in beta versions
});

// after
const player = add([
	sprite("player"),
	area(),
	solid(),
]);

// both should be solid
add([
	sprite("rock"),
	area(),
	solid(),
]);

keyDown("left", () => {
	// this will handle collision resolution for you, if the other obj is also "solid"
	player.move(-120, 0);
});
```
- added comp `opacity()` to set opacity
- added comp `health()` to manage health related logic
- added comp `move()` to manage projectile-like behavior
- added comp `cleanup()` to auto destroy obj when it leaves screen
- added comp `outline()` to draw a lil outline
- added comp `timer()` to attach timers to a game obj
- added comp `fixed()` to make a game obj unaffected by camera
- added comp `stay()` to make a game obj stay after scene switch
- added comp `lifespan()` to destroy game obj after certain amount of time
- added comp `z()` to define draw order for objs on the same layer
- added `weight` to `BodyComp` and `BodyCompOpt` to control the gravity multiplier
- added `djump()` to `BodyComp` for double jump
- added `dir()` to calculate directional vector from angle
- added constants `LEFT`, `RIGHT`, `UP`, `DOWN` for unit directional vector
- added `fullscreen()` to enable real fullscreen mode
- **BREAK** separated color and opacity, removed `rgba()` in favor of `rgb`, use component `opacity()` to define opacity
- **BREAK** changed color from 0-1 range to 0-255, angles from radians to degrees

```js
// before
add([
    rotate(Math.PI / 2),
    color(0, 0.5, 1.0, 0.5),
]);

// after
add([
    rotate(90),
    color(0, 127, 255),
    opacity(0.5)
]);
```
- `global` and `debug` flag now are enabled by default, need to turn off manually if you don't want
- added input events `touchStart(id, pos)`, `touchMove(id, pos)`, `touchEnd(id, pos)`, `mouseMove(pos)`
- added `mouseDeltaPos()`
- added `touchToMouse` to control if touch events should be translated to mouse events
- added `mousePos()` now gets the screen mouse pos, use `mouseWorldPos()` to get the mouse position affected by camera
- added `anim` field in `SpriteCompOpt` to play an anim on start
- beter type support for components
- `scene()` and `start()` (also removed in favor of `go()`) are optional now, if you don't need multiple scenes yet you can just go directly
```js
kaboom();
// no mandatory scene() to start kabooming
add(...);
keyPress(...);
```
- **BREAK** `area()` is now explicit and not automatically added by `sprite()`, `rect()`, and `text()`, removed each `noArea` or `area` config field
- **BREAK** `area()` now takes an `AreaCompOpt`, where you can define the area size, scale, and hover cursor

```js
add([
    sprite("bean"),
    area(), // empty area will derive from sprite size
    area({ scale: 0.5, }), // 0.5x the sprite size
    area({ offset: vec2(0, 12), width: 4, height: 12, }), // more control over the collider region
]);
```
- **BREAK** renamed `isCollided()` to `isColliding()`, `isHovered()` to `isHovering()`
- **BREAK** removed `overlaps()` and `isOverlapped()` and replaced with `isColliding()` and `collides()` only checks doesn't return true when 2 objects are just touching each other, use `isTouching()` to check if they're not colliding but just touching each other
- added `isTouching()` to check if 2 objects are collided or just touching other
- audio is now paused when you leave the tab
- audio is now paused on `debug.paused = true`
- added local storage helper `getData(key, default?)` and `setData(key, data)`
- added `loadShader(id, vert, frag, isUrl)`
- added `shader()` comp for attaching custom shader to an obj
- different layers do not prevent collisions now
- **BREAK** changed last argument of `loadFont()` to `FontLoadOpt`
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
- **BREAK** overlapping component fields are not allowed, e.g. you can't have a custom comp that has a `collides` field if it already have a `area` component, since it already has that
- **BREAK** changed `text(txt, size, conf)` to `text(txt, conf)` with `size` as a field
- added `obj.c(id)` for getting a specific comp's state (by default all comps' states are mounted to the obj by `Object.defineProperty`)
```js
// both works
obj.play("anim");
obj.c("sprite").play("anim");
```
- pedit, aseprite plugins are now included by default
- added `addKaboom()` for quick kaboom explosion
- `load*()` now accepts `null` as name and not load into assets manager, instead just return the resource data handle
- **BREAK** renamed event `headbump` to `headbutt`
- **BREAK** renamed event `grounded` to `ground`
- added `width`, `height`, and `tiled` attrib to `SpriteCompOpt`, for better control over sprite size and tiled sprite support
- **BREAK** renamed `resolve()` to `pushOutAll()` on `area` comp
- added `pushOut()` for pushing a single object out from another with `area` comp
- fixed `"add"` event getting called twice for tagged objs
- added `moveTo(dest: Vec2, speed?: number)` to `pos()` comp
- added `keyPress()` (and all other key events) with no arg to check for any key
- **BREAK** renamed `camShake()` to `shake()`
- added `flipX` and `flipY` on `sprite()` comp configuration, and `flipX()` `flipY()` methods
- **BREAK** remove `flipX()` and `flipY()` on `scale()` comp
- **BREAK** removed `start()` in favor of `go()`
- **BREAK** removed `changeSprite()` in favor of `use(sprite("newsprite"))`
- tags and components are converged, tags are just empty components now
- added `unuse()` to remove a component or tag
- **BREAK** removed `rmTag()` in favor of `unuse()`
- **BREAK** removed `camIgnore()` in favor of `fixed()`
- **BREAK** renamed `makeRng()` to `rng()`
- sprite animation now supports defining properties like loop and speed in load step and play step

```js
loadSprite("hero", "hero.png", {
	sliceX: 9,
	anims: {
		idle: { from: 0, to: 3, speed: 3, loop: true },
		run: { from: 4, to: 7, speed: 10, loop: true },
		hit: 8,
	},
});
```
- **BREAK** changed `.play(anim, ifLoop)` under `sprite()` to accept a dict of properties `.play(anim, { loop: true, speed: 60, pingpong: true })`
- **BREAK** now every symbol definition in `addLevel()` should be a function returning the component list, to ensure there's no weird shared states

```js
addLevel([
	"*    *",
	"*    *",
	"======",
], {
	"*": () => [
		sprite("wall"),
		area(),
		solid(),
	],
	"=": () => [
		sprite("floor"),
		area(),
		solid(),
	],
})
```
- **BREAK** renamed `clearColor` to `background`
- added collision detection functions `testLineLine()`, `testRectRect()`, `testRectLine()` etc.
- added drawing functions `drawSprite()`, `drawRect()`, `drawCircle()`, `drawPolygon()`, `drawEllipse()`, `drawLine()`, `drawLines()`
- added transformation functions `pushTransform()`, `popTransform()`, `pushTranslate()`, `pushRotate()`, `pushScale()`
- **BREAK** removed `areaWidth()` and `areaHeight()` since they won't make sense if the area shape is not rectangle, use `worldArea()` if you need area data
```js
const area = player.worldArea();
if (area.shape === "rect") {
	const width = area.p2.x - area.p1.x;
	const height = area.p2.y - area.p1.y;
}
```

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
