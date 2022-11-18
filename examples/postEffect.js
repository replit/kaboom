// Build levels with addLevel()

// Start game
kaboom()

// Load assets
loadSprite("bean", "/sprites/bean.png")
loadSprite("coin", "/sprites/coin.png")
loadSprite("spike", "/sprites/spike.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("ghosty", "/sprites/ghosty.png")
loadSound("score", "/examples/sounds/score.mp3")

const effects = [ "vhs", "pixelate", "invert" ]

effects.forEach((effect) => {
	loadShaderURL(effect, null, `/examples/shaders/${effect}.frag`)
})

let curEffect = 0
const SPEED = 480

gravity(2400)

const level = addLevel([
	// Design the level layout with symbols
	"@  ^ $$",
	"=======",
], {
	// The size of each grid
	width: 64,
	height: 64,
	// The position of the top left block
	pos: vec2(100, 200),
	// Define what each symbol means (in components)
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
	"^": () => [
		sprite("spike"),
		area(),
		anchor("bot"),
		"danger",
	],
})

// Get the player object from tag
const player = level.get("player")[0]

// Movements
onKeyPress("space", () => {
	if (player.isGrounded()) {
		player.jump()
	}
})

onKeyDown("left", () => {
	player.move(-SPEED, 0)
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
})

// Back to the original position if hit a "danger" item
player.onCollide("danger", () => {
	player.pos = level.getPos(0, 0)
})

// Eat the coin!
player.onCollide("coin", (coin) => {
	destroy(coin)
	play("score")
})

onKeyPress("up", () => {
	curEffect = curEffect === 0 ? effects.length - 1 : curEffect - 1
	label.text = effects[curEffect]
})

onKeyPress("down", () => {
	curEffect = (curEffect + 1) % effects.length
	label.text = effects[curEffect]
})

const label = add([
	pos(8, 8),
	text(effects[curEffect]),
])

add([
	pos(8, height() - 8),
	text("Press up / down to switch effects"),
	anchor("botleft"),
])

onUpdate(() => {
	usePostEffect(effects[curEffect], {
		"u_resolution": vec2(width(), height()),
		"u_size": wave(2, 16, time() * 2),
		"u_intensity": 8,
		"u_invert": 1,
	})
})
