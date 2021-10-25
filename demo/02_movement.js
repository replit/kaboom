// Input handling and basic player movement

// Start kaboom
kaboom()

// Load assets
loadSprite("bean", "sprites/bean.png")

// Define player movement speed (pixels per second)
const SPEED = 320

// Add player game object
const player = add([
	sprite("bean"),
	// center() returns the center point vec2(width() / 2, height() / 2)
	pos(center()),
])

// keuPress() registers an event that runs every frame as long as user is holding a certain key
keyDown("left", () => {
	player.move(-SPEED, 0)
})

keyDown("right", () => {
	player.move(SPEED, 0)
})

keyDown("up", () => {
	player.move(0, -SPEED)
})

keyDown("down", () => {
	player.move(0, SPEED)
})

add([
	// text() component is similar to sprite() but renders text
	text("Press arrow keys", { width: width() / 2 }),
	pos(12, 12),
])
