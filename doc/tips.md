# Tips

Here's some tips on optimizing performance / maintainability for kaboom games

## Cleanup One-off Objects

Sometimes there are some objects that gets created, leaves screen, and never seen again, like a bullet. These objects will keep being rendered / updated and be detrimental to performance if they get created a lot, it's better to remove them when they leave screen.

`offscreen()` is a component that helps you define behavior when objects go off-screen.

```js
add([
    sprite("bullet"),
    pos(player.pos),
    // the bullet move left forever
    move(LEFT, 600),
    // destroy the bullet when it's far out of view
    offscreen({ destroy: true })
])
```

## Hide Off-Screen Objects

Sometimes you might be drawing a lot of objects that's not on screen (e.g. if you have a big map and your camera only sees a small area), this is very unnessecary, use `offscreen()` component to define object's behavior when they're not on screen.

```js
// planting flowers all over the map
for (let i = 0; i < 1000; i++) {
    add([
        sprite("flower"),
        pos(rand(-5000, 5000), rand(-5000, 5000)),
        // don't draw or update the flower when they're out of view
        offscreen({ hide: true, pause: true })
    ])
}
```

## Use `await`

Kaboom use a lot of `Promise` and `Promise`-like in time / event related stuff, use `await` on those to make code look nicer

```js
async function example() {
    await wait(3)
    await tween(0, 100, 1, (x) => mark.pos.x = x)
}
```

## Avoid Global Namespace

By default Kaboom uses a lot of common names like `pos`, `sprite` that occupies global namespace, it's often better to use `global: false` to not export kaboom functions to `window`

```js
kaboom({
    global: false
})

const pos = k.vec2(120, 200)
```

## Pack sprites into a single sprite

Kaboom will optimize sprites using a single image into batched render, otherwise every sprite draw will initiate a separate draw call which is expensive. It also makes asset loading faster since you're merging multiple HTTP requests into one.

Check out this example [kaboom_texpack](https://github.com/slmjkdbtl/kaboom_texpack), where it uses [free-tex-packer-core](https://www.npmjs.com/package/free-tex-packer-core) to pack sprites at built time and `loadSpriteAtlas()` to load the packed sprite, makes it very convenient to enable batched sprite optimization.

## Disable `global` mode

By default kaboom exports all functions to global namespace to make it look simple for beginners, however it's not great for more advanced users since it pollutes global namespace with a lot of common words.

```js
// do this instead
const k = kaboom({
  global: false,
})

k.add([
  // ...
])
```

## Use Game Object local timers

When programming timer / tween behavior for a specific game object, it's better to attach `timer()` component to the game object and use that instead of global timer functions. This way the timer is tied to the life cycle of the game object, when then game object pauses or gets destroyed, the timer will not run.

```js
// prefer
const player = k.add([
  k.sprite("bean"),
  k.pos(100, 200),
  k.timer(),
  k.state("idle"),
])

// these timers will only run when player game object is not paused / destroyed
player.wait(2, () => {
  // ...
})

await player.tween(
  player.pos,
  k.mousePos(),
  0.5,
  (p) => player.pos = p,
  k.easings.easeOutQuad,
)

// this will pause all the timer events
player.paused = true

// this will stop all the timer events
player.destory()

player.onStateEnter("attack", async () => {
  // ... state code
  // if we use global k.wait() here it'll create infinitely running state transitions
  await player.wait(2)
  player.enterState("idle")
})

player.onStateEnter("idle", async () => {
  // ... state code
  // if we use global k.wait() here it'll create infinitely running state transitions
  await player.wait(1)
  player.enterState("attack")
})
```

## Use Game Object local input handlers

Similar to above, it's often better to use local input handlers as opposed to global ones.

```js
const gameScene = k.add([])

const player = gameScene.add([
  k.sprite("bean"),
  k.pos(100, 200),
  k.area(),
  k.body(),
])

// these
gameScene.onKeyPress("space", () => {
  player.jump()
})

// this will pause all the input events
gameScene.paused = true

// this will stop all the input events
gameScene.destory()
```
