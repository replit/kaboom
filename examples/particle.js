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

setGravity(800)

// Spawn one particle every 0.1 second
loop(0.1, () => {

	// TODO: they are resolving collision with each other for some reason
	// Compose particle properties with components
	const item = add([
		pos(mousePos()),
		sprite(choose(sprites)),
		anchor("center"),
		scale(rand(0.5, 1)),
		area({ collisionIgnore: ["particle"] }),
		body(),
		lifespan(1, { fade: 0.5 }),
		opacity(1),
		move(choose([LEFT, RIGHT]), rand(60, 240)),
		"particle",
	])

	item.jump(rand(320, 640))

})
