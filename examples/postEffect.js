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

const effects = {
	crt: () => ({
		"u_flatness": 3,
	}),
	vhs: () => ({
		"u_intensity": 12,
	}),
	pixelate: () => ({
		"u_resolution": vec2(width(), height()),
		"u_size": wave(2, 16, time() * 2),
	}),
	invert: () => ({
		"u_invert": 1,
	}),
	light: () => ({
		"u_radius": 64,
		"u_blur": 64,
		"u_resolution": vec2(width(), height()),
		"u_mouse": mousePos(),
	}),
}

for (const effect in effects) {
	loadShaderURL(effect, null, `/examples/shaders/${effect}.frag`)
}

let curEffect = 0
const SPEED = 480

setGravity(2400)

const level = addLevel([
	// Design the level layout with symbols
	"@  ^ $$",
	"=======",
], {
	// The size of each grid
	tileWidth: 64,
	tileHeight: 64,
	// The position of the top left block
	pos: vec2(100, 200),
	// Define what each symbol means (in components)
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
		"^": () => [
			sprite("spike"),
			area(),
			anchor("bot"),
			"danger",
		],
	},
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
	player.pos = level.tile2Pos(0, 0)
})

// Eat the coin!
player.onCollide("coin", (coin) => {
	destroy(coin)
	play("score")
})

onKeyPress("up", () => {
	const list = Object.keys(effects)
	curEffect = curEffect === 0 ? list.length - 1 : curEffect - 1
	label.text = list[curEffect]
})

onKeyPress("down", () => {
	const list = Object.keys(effects)
	curEffect = (curEffect + 1) % list.length
	label.text = list[curEffect]
})

const label = add([
	pos(8, 8),
	text(Object.keys(effects)[curEffect]),
])

add([
	pos(8, height() - 8),
	text("Press up / down to switch effects"),
	anchor("botleft"),
])

onUpdate(() => {
	const effect = Object.keys(effects)[curEffect]
	usePostEffect(effect, effects[effect]())
})
