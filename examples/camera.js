// Adjust camera / viewport

// Start game
kaboom()

// Load assets
loadSprite("bean", "/sprites/bean.png")
loadSprite("coin", "/sprites/coin.png")
loadSprite("grass", "/sprites/grass.png")
loadSound("score", "/examples/sounds/score.mp3")

const SPEED = 480

setGravity(2400)

// Setup a basic level
const level = addLevel([
	"@  =  $",
	"=======",
], {
	tileWidth: 64,
	tileHeight: 64,
	pos: vec2(100, 200),
	tiles: {
		"@": () => [
			sprite("bean"),
			area(),
			body(),
			anchor("bot"),
			"player",
		],
		"=": () => [
			sprite("grass"),
			area(),
			body({ isStatic: true }),
			anchor("bot"),
		],
		"$": () => [
			sprite("coin"),
			area(),
			anchor("bot"),
			"coin",
		],
	},
})

// Get the player object from tag
const player = level.get("player")[0]

player.onUpdate(() => {
	// Set the viewport center to player.pos
	camPos(player.worldPos())
})

player.onPhysicsResolve(() => {
	// Set the viewport center to player.pos
	camPos(player.worldPos())
})

player.onCollide("coin", (coin) => {
	destroy(coin)
	play("score")
	score++
	// Zoooom in!
	camScale(2)
})

// Movements
onKeyPress("space", () => {
	if (player.isGrounded()) {
		player.jump()
	}
})

onKeyDown("left", () => player.move(-SPEED, 0))
onKeyDown("right", () => player.move(SPEED, 0))

let score = 0

// Add a ui layer with fixed() component to make the object not affected by camera
const ui = add([
	fixed(),
])

// Add a score counter
ui.add([
	text("0"),
	pos(12),
	{ update() { this.text = score } },
])

onClick(() => {
	// Use toWorld() to transform a screen-space coordinate (like mousePos()) to the world-space coordinate, which has the camera transform applied
	addKaboom(toWorld(mousePos()))
})
