// Input handling and basic player movement

// Start kaboom
kaboom()

// Load assets
loadSprite("bean", "sprite/bean.png")
loadSprite("googoly", "sprite/googoly.png")

// Define player movement speed (pixels per second)
const SPEED = 320

// Add player game object
const player = add([
	sprite("bean"),
	pos(80, 40),
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

// TODO: put this in Event seection doc
// NOTE: Always put event registers like action(), keyPress(), collides() at root level and never inside another event handler function (e.g. keyPress() inside an action(), action() in a mouseClick()) as it'll exponantially add the number of event handlers and eventually lag your game and crash your computer.
