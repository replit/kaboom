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
loadShader("blue", null, `
uniform float u_time;
uniform float u_invert;

vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	vec4 c = def_frag();
	return mix(c, vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a), u_invert);
}
`)

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

let invert = 0

player.onGround(async () => {
	shake(12)
	invert = 1
	await wait(0.05)
	invert = 0
	await wait(0.05)
	invert = 1
	await wait(0.05)
	invert = 0
})

onUpdate(() => {
	usePostProcess("blue", {
		"u_time": time(),
		"u_invert": invert,
	})
})
