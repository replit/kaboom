

## Hide Off-Screen Objects

Sometimes you might be drawing a lot of objects that's not on screen, this is very unnessecary, use `offscreen()` component to define object's behavior when they're not on screen.

```js
// planting flowers all over the map
for (let i = 0; i < 1000; i++) {
	add([
		sprite("flower"),
		pos(rand(-5000, 5000), rand(-5000, 5000)),
        // don't render the flower when they're out of view
		offscreen({ hide: true })
	])
}
```
