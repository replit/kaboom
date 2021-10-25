// Collision handling

// Start kaboom
kaboom()

// Load assets
loadSprite("bean", "sprites/bean.png")
loadSprite("googoly", "sprites/googoly.png")

// Define player movement speed
const SPEED = 320

// Add player game object
const player = add([
	sprite("bean"),
	pos(80, 40),
	// area() component gives the object a collider, which enables collision checking
	area(),
	color(),
])

// Register input handlers & movement
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

// Add enemies
for (let i = 0; i < 3; i++) {

	const y = height() / 4 * (i + 1)

	add([
		sprite("googoly"),
		pos(320, y),
		// both objects must have area() component to enable collision detection between
		area(),
		"enemy",
	])

}

// .collides() is provided by area() component, it registers an event that runs when an objects collides with another object with certain tag
// In this case we destroy (remove from game) the enemy when player hits one
player.collides("enemy", (enemy) => {
	destroy(enemy)
})

// .clicks() is provided by area() component, it registers an event that runs when the object is clicked
player.clicks(() => {
	debug.log("what up")
})

player.action(() => {
	// .isHovering() is provided by area() component, which returns a boolean of if the object is currently being hovered on
	if (player.isHovering()) {
		player.color = rgb(0, 0, 255)
	} else {
		player.color = rgb()
	}
})

// Enter inspect mode, which shows the collider outline of each object with area() component, handy for debugging (can also be toggled by pressing F1)
debug.inspect = true
