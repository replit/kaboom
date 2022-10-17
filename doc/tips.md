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
    await onKeyPress("space")
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
