// Adding game objects to screen

// Start a kaboom game
kaboom()

// Load a sprite asset from "sprites/bean.png", with the name "bean"
loadSprite("grass", "/sprites/grass.png", {
	slice9: {
		left: 8,
		right: 8,
		top: 8,
		bottom: 8,
	},
})

const g = add([
	sprite("grass"),
])

onMouseMove(() => {
	const mpos = mousePos()
	g.width = mpos.x
	g.height = mpos.y
})
