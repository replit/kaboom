// Mario-like flamebar

// Start kaboom
kaboom()

// Load assets
loadSprite("bean", "/sprites/bean.png")
loadSprite("pineapple", "/sprites/pineapple.png")

// Define player movement speed
const SPEED = 320

// Add player game object
const player = add([
	sprite("bean"),
	pos(80, 40),
	area(),
])

// Player movement
onKeyDown("left", () => {
	player.move(-SPEED, 0)
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
})

onKeyDown("up", () => {
	player.move(0, -SPEED)
})

onKeyDown("down", () => {
	player.move(0, SPEED)
})

// Function to add a flamebar
function addFlamebar(position = vec2(0), angle = 0, num = 6) {

	// Create a parent game object for position and rotation
	const flameHead = add([
		pos(position),
		rotate(angle),
	])

	// Add each section of flame as children
	for (let i = 0; i < num; i++) {
		flameHead.add([
			sprite("pineapple"),
			pos(0, i * 48),
			area(),
			anchor("center"),
			"flame",
		])
	}

	// The flame head's rotation will affect all its children
	flameHead.onUpdate(() => {
		flameHead.angle += dt() * 60
	})

	return flameHead

}

addFlamebar(vec2(200, 300), -60)
addFlamebar(vec2(480, 100), 180)
addFlamebar(vec2(400, 480), 0)

// Game over if player touches a flame
player.onCollide("flame", () => {
	addKaboom(player.pos)
	player.destroy()
})
