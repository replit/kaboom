// Adding game objects to screen

// Start a kaboom game
kaboom()

// Load a sprite asset from "sprites/bean.png", with the name "bean"
loadSprite("bean", "sprite/bean.png")
loadSprite("googoly", "sprite/googoly.png")

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

// action() is a method comes with every game object, it registers an event that runs every frame (typically runs 60 times per second)
player.action(() => {
	// move() is a method provided by the pos() component to move with a velocity
	// Here we're moving towards the right at 100 pixels per second
	player.move(100, 0)
})

// Add multiple game objects
for (let i = 0; i < 3; i++) {

	// Generate a number from 0 to game height
	const y = rand(0, height())

	add([
		sprite("googoly"),  // This also renders as a sprite
		pos(160, y),        // Give it a random Y position from 0 to game height
		scale(2),           // scale() component gives it scale
		rotate(45),         // rotate() component gives it rotation
		origin("center"),   // origin() component defines the pivot point (defaults to "topleft")
		"enemy",            // strings here are tags
	])

}

// Plain action() is similar to obj.action(), but instead it operates on all objects that shares a specific tag.
// In this case we're running this function with every game object with tag "enemy"
action("enemy", (enemy) => {
	// .angle is a property provided by rotate() component
	// Increment the angle of every "enemy" by 120 degrees per second
	enemy.angle += 120 * dt()
})

// NOTE: never put a action() inside another action() as it'll exponantially add the number of stuff running each frame and eventually lag and crash your computer
