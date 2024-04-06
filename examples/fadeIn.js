// Adding game objects to screen

// Start a kaboom game
kaboom()

// Load a sprite asset from "sprites/bean.png", with the name "bean"
loadSprite("bean", "/sprites/bean.png")
loadSprite("ghosty", "/sprites/ghosty.png")

// A "Game Object" is the basic unit of entity in kaboom
// Game objects are composed from components
// Each component gives a game object certain capabilities

// add() assembles a game object from a list of components and add to game, returns the reference of the game object. this object will fadeIn to opacty 1
const player = add([
	sprite("bean"),   // sprite() component makes it render as a sprite
	pos(120, 80),     // pos() component gives it position, also enables movement
	rotate(0),        // rotate() component gives it rotation
	anchor("center"), // anchor() component defines the pivot point (defaults to "topleft")
	opacity(),        // opacity() component gives it opacity
	fadeIn(),         // fadeIn() component makes it fade in
])

// add() assembles a game object from a list of components and add to game, returns the reference of the game object. this object will fadeIn to opacty 0.5
let invisibleBean = add([
	sprite("bean"),   // sprite() component makes it render as a sprite
	pos(240, 80),     // pos() component gives it position, also enables movement
	rotate(0),        // rotate() component gives it rotation
	anchor("center"), // anchor() component defines the pivot point (defaults to "topleft")
	opacity(0.5),     // opacity() component gives it opacity (set to 0.5 so it will be half transparent)
	fadeIn(),         // fadeIn() component makes it fade in
])

// .onUpdate() is a method on all game objects, it registers an event that runs every frame
player.onUpdate(() => {
	// .angle is a property provided by rotate() component, here we're incrementing the angle by 120 degrees per second, dt() is the time elapsed since last frame in seconds
	player.angle += 120 * dt()
})

// .onUpdate() is a method on all game objects, it registers an event that runs every frame
invisibleBean.onUpdate(() => {
	// .angle is a property provided by rotate() component, here we're incrementing the angle by 120 degrees per second, dt() is the time elapsed since last frame in seconds
	invisibleBean.angle += -120 * dt()
})

// Add multiple game objects
for (let i = 0; i < 3; i++) {

	// generate a random point on screen
	// width() and height() gives the game dimension
	const x = rand(0, width())
	const y = rand(0, height())

	add([
		sprite("ghosty"),
		pos(x, y),
		opacity(0.25),     // opacity() component gives it opacity (set to 0.25 so it will be quarter transparent)
		fadeIn(),         // fadeIn() component makes it fade in
	])

}
