// Responding to gravity & jumping

// Start kaboom
kaboom()

// Load assets
loadSprite("bean", "/sprites/bean.png")

// Set the gravity acceleration (pixels per second)
setGravity(1600)

// Add player game object
const player = add([
	sprite("bean"),
	pos(center()),
	area(),
	// body() component gives the ability to respond to gravity
	body(),
])

onKeyPress("space", () => {
	// .isGrounded() is provided by body()
	if (player.isGrounded()) {
		// .jump() is provided by body()
		player.jump()
	}
})

// .onGround() is provided by body(). It registers an event that runs whenever player hits the ground.
player.onGround(() => {
	debug.log("ouch")
})

// Accelerate falling when player holding down arrow key
onKeyDown("down", () => {
	if (!player.isGrounded()) {
		player.vel.y += dt() * 1200
	}
})

// Jump higher if space is held
onKeyDown("space", () => {
	if (!player.isGrounded() && player.vel.y < 0) {
		player.vel.y -= dt() * 600
	}
})

// Add a platform to hold the player
add([
	rect(width(), 48),
	outline(4),
	area(),
	pos(0, height() - 48),
	// Give objects a body() component if you don't want other solid objects pass through
	body({ isStatic: true }),
])

add([
	text("Press space key", { width: width() / 2 }),
	pos(12, 12),
])

// Check out https://kaboomjs.com#BodyComp for everything body() provides
