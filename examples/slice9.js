// 9 slice sprite scaling

kaboom()

// Load a sprite that's made for 9 slice scaling
loadSprite("9slice", "/examples/sprites/9slice.png", {
	// Define the slice by the margins of 4 sides
	slice9: {
		left: 32,
		right: 32,
		top: 32,
		bottom: 32,
	},
})

const g = add([
	sprite("9slice"),
])

onMouseMove(() => {
	const mpos = mousePos()
	// Scaling the image will keep the aspect ratio of the sliced frames
	g.width = mpos.x
	g.height = mpos.y
})
