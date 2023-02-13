// TODO: document

kaboom({
	background: [74, 48, 82],
})

const objs = [
	"apple",
	"lightening",
	"coin",
	"egg",
	"key",
	"door",
	"meat",
	"mushroom",
]

for (const obj of objs) {
	loadSprite(obj, `/sprites/${obj}.png`)
}

loadBean()
loadSound("hit", "/examples/sounds/hit.mp3")
loadSound("shoot", "/examples/sounds/shoot.mp3")
loadSound("explode", "/examples/sounds/explode.mp3")
loadSound("OtherworldlyFoe", "/examples/sounds/OtherworldlyFoe.mp3")

scene("battle", () => {

	const BULLET_SPEED = 1200
	const TRASH_SPEED = 120
	const BOSS_SPEED = 48
	const PLAYER_SPEED = 480
	const STAR_SPEED = 120
	const BOSS_HEALTH = 1000
	const OBJ_HEALTH = 4

	const bossName = choose(objs)

	let insaneMode = false

	const music = play("OtherworldlyFoe")

	volume(0.5)

	function grow(rate) {
		return {
			update() {
				const n = rate * dt()
				this.scale.x += n
				this.scale.y += n
			},
		}
	}

	function late(t) {
		let timer = 0
		return {
			add() {
				this.hidden = true
			},
			update() {
				timer += dt()
				if (timer >= t) {
					this.hidden = false
				}
			},
		}
	}

	add([
		text("KILL", { size: 160 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(1),
		fixed(),
	])

	add([
		text("THE", { size: 80 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(2),
		late(1),
		fixed(),
	])

	add([
		text(bossName.toUpperCase(), { size: 120 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(4),
		late(2),
		fixed(),
	])

	const sky = add([
		rect(width(), height()),
		color(0, 0, 0),
		opacity(0),
	])

	sky.onUpdate(() => {
		if (insaneMode) {
			const t = time() * 10
			sky.color.r = wave(127, 255, t)
			sky.color.g = wave(127, 255, t + 1)
			sky.color.b = wave(127, 255, t + 2)
			sky.opacity = 1
		} else {
			sky.color = rgb(0, 0, 0)
			sky.opacity = 0
		}
	})

	// 	add([
	// 		sprite("stars"),
	// 		scale(width() / 240, height() / 240),
	// 		pos(0, 0),
	// 		"stars",
	// 	])

	// 	add([
	// 		sprite("stars"),
	// 		scale(width() / 240, height() / 240),
	// 		pos(0, -height()),
	// 		"stars",
	// 	])

	// 	onUpdate("stars", (r) => {
	// 		r.move(0, STAR_SPEED * (insaneMode ? 10 : 1))
	// 		if (r.pos.y >= height()) {
	// 			r.pos.y -= height() * 2
	// 		}
	// 	})

	const player = add([
		sprite("bean"),
		area(),
		pos(width() / 2, height() - 64),
		anchor("center"),
	])

	onKeyDown("left", () => {
		player.move(-PLAYER_SPEED, 0)
		if (player.pos.x < 0) {
			player.pos.x = width()
		}
	})

	onKeyDown("right", () => {
		player.move(PLAYER_SPEED, 0)
		if (player.pos.x > width()) {
			player.pos.x = 0
		}
	})

	onKeyPress("up", () => {
		insaneMode = true
		music.speed = 2
	})

	onKeyRelease("up", () => {
		insaneMode = false
		music.speed = 1
	})

	player.onCollide("enemy", (e) => {
		destroy(e)
		destroy(player)
		shake(120)
		play("explode")
		music.detune = -1200
		addExplode(center(), 12, 120, 30)
		wait(1, () => {
			music.paused = true
			go("battle")
		})
	})

	function addExplode(p, n, rad, size) {
		for (let i = 0; i < n; i++) {
			wait(rand(n * 0.1), () => {
				for (let i = 0; i < 2; i++) {
					add([
						pos(p.add(rand(vec2(-rad), vec2(rad)))),
						rect(4, 4),
						scale(1 * size, 1 * size),
						lifespan(0.1),
						grow(rand(48, 72) * size),
						anchor("center"),
					])
				}
			})
		}
	}

	function spawnBullet(p) {
		add([
			rect(12, 48),
			area(),
			pos(p),
			anchor("center"),
			color(127, 127, 255),
			outline(4),
			move(UP, BULLET_SPEED),
			offscreen({ destroy: true }),
			// strings here means a tag
			"bullet",
		])
	}

	onUpdate("bullet", (b) => {
		if (insaneMode) {
			b.color = rand(rgb(0, 0, 0), rgb(255, 255, 255))
		}
	})

	onKeyPress("space", () => {
		spawnBullet(player.pos.sub(16, 0))
		spawnBullet(player.pos.add(16, 0))
		play("shoot", {
			volume: 0.3,
			detune: rand(-1200, 1200),
		})
	})

	function spawnTrash() {
		const name = choose(objs.filter(n => n != bossName))
		add([
			sprite(name),
			area(),
			pos(rand(0, width()), 0),
			health(OBJ_HEALTH),
			anchor("bot"),
			"trash",
			"enemy",
			{ speed: rand(TRASH_SPEED * 0.5, TRASH_SPEED * 1.5) },
		])
		wait(insaneMode ? 0.1 : 0.3, spawnTrash)
	}

	const boss = add([
		sprite(bossName),
		area(),
		pos(width() / 2, 40),
		health(BOSS_HEALTH),
		scale(3),
		anchor("top"),
		"enemy",
		{
			dir: 1,
		},
	])

	on("death", "enemy", (e) => {
		destroy(e)
		shake(2)
		addKaboom(e.pos)
	})

	on("hurt", "enemy", (e) => {
		shake(1)
		play("hit", {
			detune: rand(-1200, 1200),
			speed: rand(0.2, 2),
		})
	})

	const timer = add([
		text(0),
		pos(12, 32),
		fixed(),
		{ time: 0 },
	])

	timer.onUpdate(() => {
		timer.time += dt()
		timer.text = timer.time.toFixed(2)
	})

	onCollide("bullet", "enemy", (b, e) => {
		destroy(b)
		e.hurt(insaneMode ? 10 : 1)
		addExplode(b.pos, 1, 24, 1)
	})

	onUpdate("trash", (t) => {
		t.move(0, t.speed * (insaneMode ? 5 : 1))
		if (t.pos.y - t.height > height()) {
			destroy(t)
		}
	})

	boss.onUpdate((p) => {
		boss.move(BOSS_SPEED * boss.dir * (insaneMode ? 3 : 1), 0)
		if (boss.dir === 1 && boss.pos.x >= width() - 20) {
			boss.dir = -1
		}
		if (boss.dir === -1 && boss.pos.x <= 20) {
			boss.dir = 1
		}
	})

	boss.onHurt(() => {
		healthbar.set(boss.hp())
	})

	boss.onDeath(() => {
		music.stop()
		go("win", {
			time: timer.time,
			boss: bossName,
		})
	})

	const healthbar = add([
		rect(width(), 24),
		pos(0, 0),
		color(107, 201, 108),
		fixed(),
		{
			max: BOSS_HEALTH,
			set(hp) {
				this.width = width() * hp / this.max
				this.flash = true
			},
		},
	])

	healthbar.onUpdate(() => {
		if (healthbar.flash) {
			healthbar.color = rgb(255, 255, 255)
			healthbar.flash = false
		} else {
			healthbar.color = rgb(127, 255, 127)
		}
	})

	add([
		text("UP: insane mode", { width: width() / 2, size: 32 }),
		anchor("botleft"),
		pos(24, height() - 24),
	])

	spawnTrash()

})

scene("win", ({ time, boss }) => {

	const b = burp({
		loop: true,
	})

	loop(0.5, () => {
		b.detune = rand(-1200, 1200)
	})

	add([
		sprite(boss),
		color(255, 0, 0),
		anchor("center"),
		scale(8),
		pos(width() / 2, height() / 2),
	])

	add([
		text(time.toFixed(2), 24),
		anchor("center"),
		pos(width() / 2, height() / 2),
	])

})

go("battle")
