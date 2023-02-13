// bean is holding a concert to celebrate kaboom2000!

kaboom({
	scale: 0.7,
	background: [ 128, 180, 255 ],
})

// TODO: add more friends
const friends = [
	"bag",
	"ghosty",
	"bobo",
	"gigagantrum",
]

for (const friend of friends) {
	loadSprite(friend, `/sprites/${friend}.png`)
}

loadSprite("bean", "/sprites/bean.png")
loadSprite("note", "/sprites/note.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("cloud", "/sprites/cloud.png")
loadSprite("sun", "/sprites/sun.png")
loadSound("bell", "/examples/sounds/bell.mp3")
loadSound("kaboom2000", "/examples/sounds/kaboom2000.mp3")

const FLOOR_HEIGHT = 64
const JUMP_FORCE = 1320
const CAPTION_SPEED = 340
const PLAYER_SPEED = 640

let started = false
let music = null
let burping = false

// define gravity
setGravity(2400)

// add a game object to screen
const player = add([
	// list of components
	sprite("bean"),
	pos(width() / 2, height() - FLOOR_HEIGHT),
	area(),
	body(),
	anchor("bot"),
	z(100),
])

const gw = 200
const gh = 140
const maxRow = 4
const notes = [ 0, 2, 4, 5, 6, 7, 8, 9, 11, 12 ]

for (let i = 1; i <= maxRow; i++) {
	for (let j = 0; j < i; j++) {
		const n = i * (i - 1) / 2 + j
		const w = (i - 1) * gw + 64
		add([
			sprite("note"),
			pos(j * gw + (width() - w) / 2 + 32, height() - FLOOR_HEIGHT + 24 - (maxRow - i + 1) * gh),
			area(),
			body({ isStatic: true }),
			anchor("bot"),
			color(hsl2rgb((n * 20) / 255, 0.6, 0.7)),
			bounce(),
			scale(1),
			n === 0 ? "burp" : "note",
			{ detune: notes[9 - n] * 100 + -800 },
		])
	}
}

function bounce() {
	let bouncing = false
	let timer = 0
	return {
		id: "bounce",
		require: [ "scale" ],
		update() {
			if (bouncing) {
				timer += dt() * 20
				const w = Math.sin(timer) * 0.1
				if (w < 0) {
					bouncing = false
					timer = 0
				} else {
					this.scale = vec2(1 + w)
				}
			}
		},
		bounce() {
			bouncing = true
		},
	}
}

// floor
for (let x = 0; x < width(); x += 64) {
	add([
		pos(x, height()),
		sprite("grass"),
		anchor("botleft"),
		area(),
		body({ isStatic: true }),
	])
}

function jump() {
	if (player.isGrounded()) {
		player.jump(JUMP_FORCE)
	}
}

// jump when user press space
onKeyPress("space", jump)
onKeyDown("left", () => player.move(-PLAYER_SPEED, 0))
onKeyDown("right", () => player.move(PLAYER_SPEED, 0))

player.onHeadbutt((block) => {
	if (block.is("note")) {
		play("bell", {
			detune: block.detune,
			volume: 0.1,
		})
		addKaboom(block.pos)
		shake(1)
		block.bounce()
		if (!started) {
			started = true
			caption.hidden = false
			caption.paused = false
			music = play("kaboom2000")
		}
	} else if (block.is("burp")) {
		burp()
		shake(480)
		if (music) music.paused = true
		burping = true
		player.paused = true
	}
})

onUpdate(() => {
	if (!burping) return
	camPos(camPos().lerp(player.pos, dt() * 3))
	camScale(camScale().lerp(vec2(5), dt() * 3))
})

const lyrics = "kaboom2000 is out today, i have to go and try it out now... oh it's so fun it's so fun it's so fun...... it's so fun it's so fun it's so fun!"

const caption = add([
	text(lyrics, {
		transform(idx) {
			return {
				color: hsl2rgb(((time() * 60 + idx * 20) % 255) / 255, 0.7, 0.8),
				scale: wave(1, 1.2, time() * 3 + idx),
				angle: wave(-9, 9, time() * 3 + idx),
			}
		},
	}),
	pos(width(), 32),
	move(LEFT, CAPTION_SPEED),
])

caption.hidden = true
caption.paused = true

function funky() {
	let timer = 0
	return {
		id: "funky",
		require: [ "pos", "rotate" ],
		update() {
			timer += dt()
			this.angle = wave(-9, 9, timer * 4)
		},
	}
}

function spawnCloud() {

	const dir = choose([LEFT, RIGHT])

	add([
		sprite("cloud", { flipX: dir.eq(LEFT) }),
		move(dir, rand(20, 60)),
		offscreen({ destroy: true }),
		pos(dir.eq(LEFT) ? width() : 0, rand(-20, 480)),
		anchor("top"),
		area(),
		z(-50),
	])

	wait(rand(6, 12), spawnCloud)

}

function spawnFriend() {

	const friend = choose(friends)
	const dir = choose([LEFT, RIGHT])

	add([
		sprite(friend, { flipX: dir.eq(LEFT) }),
		move(dir, rand(120, 320)),
		offscreen({ destroy: true }),
		pos(dir.eq(LEFT) ? width() : 0, height() - FLOOR_HEIGHT),
		area(),
		rotate(),
		funky(),
		anchor("bot"),
		z(50),
	])

	wait(rand(1, 3), spawnFriend)

}

spawnCloud()
spawnFriend()

const sun = add([
	sprite("sun"),
	anchor("center"),
	pos(width() - 90, 90),
	rotate(),
	z(-100),
])

sun.onUpdate(() => {
	sun.angle += dt() * 12
})
