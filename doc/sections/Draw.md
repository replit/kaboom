Kaboom exposes all of the drawing interfaces it uses in the render components like `sprite()`, and you can use these drawing functions to build your own richer render components.

Also note that you have to put `drawXXX()` functions inside an `onDraw()` event or the `draw()` hook in component definitions which runs every frame (after the `update` events), or it'll be immediately cleared next frame and won't persist.

```js
onDraw(() => {

	drawSprite({
		sprite: "froggy",
		pos: vec2(120, 160),
		angle: 90,
	})

	drawLine({
		p1: vec2(0),
		p2: mousePos(),
		width: 4,
		color: rgb(0, 0, 255),
	})

})
```

There's also the option to use Kaboom purely as a rendering library. Check out the [draw](/play?demo=draw) demo.
