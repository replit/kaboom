// Adding game objects to screen

// Start a kaboom game
kaboom({
	virtualControls: true,
	width: 240,
	height: 240,
	letterbox: true,
})

// Load a sprite asset from "sprites/bean.png", with the name "bean"
loadSprite("bean", "/sprites/bean.png")
loadSprite("ghosty", "/sprites/ghosty.png")

// A "Game Object" is the basic unit of entity in kaboom
// Game objects are composed from components
// Each component gives a game object certain capabilities

// add() assembles a game object from a list of components and add to game, returns the reference of the game object
const player = add([
	sprite("bean"),   // sprite() component makes it render as a sprite
	pos(120, 80),     // pos() component gives it position, also enables movement
	rotate(0),        // rotate() component gives it rotation
	anchor("center"), // anchor() component defines the pivot point (defaults to "topleft")
])

onVirtualButtonDown("A", () => {
	player.move(100, 100)
})
