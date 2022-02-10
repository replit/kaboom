// Particle spawning

kaboom()

const sprites = [
	"apple",
	"heart",
	"coin",
	"meat",
	"lightening",
]

sprites.forEach((spr) => {
	loadSprite(spr, `/sprites/${spr}.png`)
})

// Spawn one particle every 0.1 second
loop(0.1, () => {

	// Compose particle properties with components
	const item = add([
		pos(mousePos()),
		sprite(choose(sprites)),
		origin("center"),
		scale(rand(0.5, 1)),
		area(),
		body({ solid: false }),
		lifespan(1, { fade: 0.5 }),
		move(choose([LEFT, RIGHT]), rand(60, 240)),
	])

	item.jump(rand(320, 640))

})
