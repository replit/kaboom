// Adding game objects to screen

// Start a kaboom game
kaboom()

// Load a sprite asset from "sprites/bean.png", with the name "bean"
loadSprite("bean", "sprites/bean.png")
loadSprite("googoly", "sprites/googoly.png")

// A "Game Object" is the basic unit of entity in kaboom
// Game objects are composed from multiple components
// Each component gives a game object certain capabilities

// Add a game object to the game from a list of components, and assign the game object reference to variable "player"
const player = add([
	sprite("bean"), // sprite() component makes it render as a sprite
	pos(80, 40),    // pos() component gives it position, also enables movement
])

// flipX() is a method provided by the sprite() component to flip the sprite texture
player.flipX()

// Add multiple game objects
for (let i = 0; i < 3; i++) {

	const y = height() / 4 * (i + 1)

	add([
		sprite("googoly"),  // This also renders as a sprite
		pos(320, y),        // Give it a random Y position from 0 to game height
		rotate(45),         // rotate() component gives it rotation
		origin("center"),   // origin() component defines the pivot point (defaults to "topleft")
		"enemy",            // strings here are tags
	])

}

// Plain action() is similar to obj.action(), but instead it operates on all objects that shares a specific tag.
// In this case we're running this function with every game object with tag "enemy"
onUpdate("enemy", (enemy) => {
	// .angle is a property provided by rotate() component
	// Increment the angle of every "enemy" by 120 degrees per second
	enemy.angle += 120 * dt()
})
