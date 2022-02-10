// Adjust camera / viewport

// Start game
kaboom()

// Load assets
loadSprite("bean", "/sprites/bean.png")
loadSprite("coin", "/sprites/coin.png")
loadSprite("grass", "/sprites/grass.png")
loadSound("score", "/sounds/score.mp3")

const SPEED = 480

gravity(2400)

// Setup a basic level
addLevel([
	"@  =  $",
	"=======",
], {
	width: 64,
	height: 64,
	pos: vec2(100, 200),
	"@": () => [
		sprite("bean"),
		area(),
		body(),
		origin("bot"),
		"player",
	],
	"=": () => [
		sprite("grass"),
		area(),
		solid(),
		origin("bot"),
	],
	"$": () => [
		sprite("coin"),
		area(),
		origin("bot"),
		"coin",
	],
})

// Get the player object from tag
const player = get("player")[0]

player.onUpdate(() => {
	// Set the viewport center to player.pos
	camPos(player.pos)
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

// Add a score counter
add([
	text("0"),
	pos(12),
	// Use fixed() component to make the object not affected by camera
	fixed(),
	{ update() { this.text = score } },
])

onClick(() => {
	// Use toWorld() to transform a screen-space coordinate (like mousePos()) to the world-space coordinate, which has the camera transform applied
	const worldMousePos = toWorld(mousePos())
	addKaboom(worldMousePos)
})
