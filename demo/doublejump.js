kaboom()

loadSprite("bean", "/sprites/bean.png")
loadSprite("coin", "/sprites/coin.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("spike", "/sprites/spike.png")
loadSound("coin", "/sounds/score.mp3")

const PLAYER_SPEED = 640
const JUMP_FORCE = 1200
const NUM_PLATFORMS = 5

// a spinning component for fun
function spin(speed = 1200) {
	let spinning = false
	return {
		require: [ "rotate", ],
		update() {
			if (!spinning) {
				return
			}
			this.angle -= speed * dt()
			if (this.angle <= -360) {
				spinning = false
				this.angle = 0
			}
		},
		spin() {
			spinning = true
		},
	}
}

scene("game", () => {

	gravity(4000)

	const score = add([
		text("0", 24),
		pos(24, 24),
		{
			value: 0,
		},
	])

	const bean = add([
		sprite("bean"),
		area(),
		origin("center"),
		pos(0, 0),
		body({ jumpForce: JUMP_FORCE, }),
		rotate(0),
		spin(),
	])

	for (let i = 1; i < NUM_PLATFORMS; i++) {
		add([
			sprite("grass"),
			area(),
			pos(rand(0, width()), i * height() / NUM_PLATFORMS),
			solid(),
			origin("center"),
			"platform",
			{
				speed: rand(120, 320),
				dir: choose([-1, 1]),
			},
		])
	}

	// go to the first platform
	bean.pos = get("platform")[0].pos.sub(0, 64)

	function genCoin(avoid) {
		const plats = get("platform")
		let idx = randi(0, plats.length)
		// avoid the spawning on the same platforms
		if (avoid != null) {
			idx = choose([...plats.keys()].filter((i) => i !== avoid))
		}
		const plat = plats[idx]
		add([
			pos(),
			origin("center"),
			sprite("coin"),
			area(),
			follow(plat, vec2(0, -60)),
			"coin",
			{ idx: idx, },
		])
	}

	genCoin(0)

	for (let i = 0; i < width() / 64; i++) {
		add([
			pos(i * 64, height()),
			sprite("spike"),
			area(),
			origin("bot"),
			scale(),
			"danger",
		])
	}

	bean.onCollide("danger", () => {
		go("lose")
	})

	bean.onCollide("coin", (c) => {
		destroy(c)
		play("coin")
		score.value += 1
		score.text = score.value
		genCoin(c.idx)
	})

	// spin on double jump
	bean.onDoubleJump(() => {
		bean.spin()
	})

	onUpdate("platform", (p) => {
		p.move(p.dir * p.speed, 0)
		if (p.pos.x < 0 || p.pos.x > width()) {
			p.dir = -p.dir
		}
	})

	onKeyPress("space", () => {
		bean.doubleJump()
	})

	// both keys will trigger
	onKeyDown("left", () => {
		bean.move(-PLAYER_SPEED, 0)
	})

	onKeyDown("right", () => {
		bean.move(PLAYER_SPEED, 0)
	})

	let time = 30

	const timer = add([
		origin("topright"),
		pos(width() - 24, 24),
		text(time),
	])

	onUpdate(() => {
		time -= dt()
		if (time <= 0) {
			go("win", score.value)
		}
		timer.text = time.toFixed(2)
	})

})

scene("win", (score) => {

	add([
		sprite("bean"),
		pos(width() / 2, height() / 2 - 80),
		scale(2),
		origin("center"),
	])

	// display score
	add([
		text(score),
		pos(width() / 2, height() / 2 + 80),
		scale(2),
		origin("center"),
	])

	// go back to game with space is pressed
	onKeyPress("space", () => go("game"))

})

scene("lose", () => {
	add([
		text("You Lose"),
	])
	onKeyPress("space", () => {
		go("game")
	})
})

go("game")
