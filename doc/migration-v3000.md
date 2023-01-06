# Migrating to v3000

- `obj._id` is renamed to `obj.id`
```js
const obj = add([
    pos(300, 200),
    sprite("bean"),
    area(),
])

// before
console.log(obj._id)

// v3000
console.log(obj.id)
```

- `origin()` is renamed to `anchor()`
```js
// before
add([
    sprite("bean"),
    origin("center"),
])

// v3000
add([
    sprite("bean"),
    anchor("center"),
])
```

- `obj.onHover()` in `area()` comp is renamed to `obj.onHoverUpdate()`, `obj.onHover()` now only runs once when obj is hovered
```js
const obj = add([
    pos(300, 200),
    sprite("bean"),
    area(),
])

// before
obj.onHover(() => {
    console.log("this will print every frame when obj is hovered")
}, () => {
    console.log("this will print every frame when obj is not hovered")
})

// v3000
obj.onHover(() => {
    console.log("this will run once when obj is hovered")
})

obj.onHoverUpdate(() => {
    console.log("this will run every frame when obj is hovered")
})

obj.onHoverEnd(() => {
    console.log("this will run once when obj stopped being hovered")
})
```

- `solid()` comp becomes an option in `body({ isSolid: true })`
```js
// before
add([
    sprite("bean"),
    area(),
    body(),
    solid(),
])

// v3000
add([
    sprite("bean"),
    area(),
    body({ isSolid: true }),
])
```

- gravity now needs to be manually enabled
```js
// before, gravity will be enabled by body() component
add([
    pos(100, 100),
    sprite("bean"),
    area(),
    body(),
])

// v3000, use gravity() to manually enable gravity
gravity(1600)

add([
    pos(100, 100),
    sprite("bean"),
    area(),
    body(),
])
```

- `body.weight` is renamed to `body.gravityScale`
```js
// before
add([
    body({ weight: 2 }),
])

// before
add([
    body({ gravityScale: 2 }),
])
```

- `body.doubleJump()` is removed in favor of new `doubleJump()` component
```js
const obj = add([
    pos(100, 100),
    sprite("bean"),
    area(),
    body(),
])

obj.doubleJump()

// after
const obj = add([
    pos(100, 100),
    sprite("bean"),
    area(),
    body(),
    doubleJump(),
])

obj.doubleJump()
```

- `body.onFall()` is renamed to `body.onFallOff()`, `body.onFall()` now runs when body is in the air and starts to fall
```js
gravity(1600)

const obj = add([
    pos(100, 100),
    sprite("bean"),
    area(),
    body(),
])

// before
obj.onFall(() => {
    console.log("this will print when object falls off a platform")
})

// v3000
obj.onFallOff(() => {
    console.log("this will print when object falls off a platform")
})

obj.onFall(() => {
    console.log("this will print when object is in the air and starts falling")
})
```

- removed `outview()` in favor of `offscreen()`, which is less accurate but much faster
```js
// before
add([
    sprite("flower"),
    outview({ hide: true }),
])

// v3000
add([
    sprite("flower"),
    // will hide itself when its position is 64 pixels offscreen
    offscreen({ hide: true, distance: 64 }),
])
```

- removed `cleanup()` in favor of `offscreen({ destroy: true })`
```js
// before
add([
    pos(player.pos),
    sprite("bullet"),
    cleanup(),
])

// v3000
add([
    pos(player.pos),
    sprite("bullet"),
    offscreen({ destroy: true }),
])
```

- `sprite.flipX` and `sprite.flipY` becomes properties instead of functions
```js
const bean = add([
    sprite("bean")
])

// before
bean.flipX(true)

// v3000
bean.flipX = true
```

- `loadFont()` now only loads `.ttf`, `.otf`, `.woff` etc fonts that browser support, use `loadBitmapFont()` to load bitmap fonts
```js
// before
loadFont("unscii", "/examples/fonts/unscii_8x8.png", 8, 8)

// v3000
loadBitmapFont("unscii", "/examples/fonts/unscii_8x8.png", 8, 8)
loadFont("apl386", "/examples/fonts/apl386.ttf")
```

- removed builtin fonts `apl386`, `apl386o`, `sink` and `sinko`, using browser built-in `monospace` font as default font now
- changed vertex format from `vec3` to `vec2` (only applied in shaders)
```js
// before
loadShader("test", null, `
vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}
`)

// v3000
loadShader("test", null, `
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}
`)
```

- changed all event handlers to return an `EventController` object, instead of a function to cancel
```js
// before
const cancel = onUpdate(() => { /* ... */ })
cancel()

// v3000
const ev = onUpdate(() => { /* ... */ })
ev.paused = true
ev.cancel()
```
