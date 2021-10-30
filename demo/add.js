// Adding game objects to screen

// Start a kaboom game
kaboom()

// Load a sprite asset from "sprites/bean.png", with the name "bean"
loadSprite("bean", "sprites/bean.png")
loadSprite("ghosty", "sprites/ghosty.png")

// A "Game Object" is the basic unit of entity in kaboom
// Game objects are composed from multiple components
// Each component gives a game object certain capabilities

// Add a game object to the game from a list of components, and assign the game object reference to variable "player"
const player = add([
	sprite("bean"),   // sprite() component makes it render as a sprite
	pos(120, 80),      // pos() component gives it position, also enables movement
	rotate(0),        // rotate() component gives it rotation
	origin("center"), // origin() component defines the pivot point (defaults to "topleft")
])

// .onUpdate() is a method on all game objects, it registers an event that runs every frame
player.onUpdate(() => {
	// .angle is a property provided by rotate() component, here we're incrementing the angle by 120 degrees per second, dt() is the time elapsed since last frame in seconds
	player.angle += 120 * dt()
})

// Add multiple game objects
for (let i = 0; i < 3; i++) {
	add([
		sprite("ghosty"),  // This also renders as a sprite
		pos(rand(0, width()), rand(0, height())),       // Give it a random Y position from 0 to game height
	])
}
