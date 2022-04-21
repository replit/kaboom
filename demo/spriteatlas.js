kaboom({
	scale: 4,
	clearColor: [0, 0, 0],
})

// https://0x72.itch.io/dungeontileset-ii
loadSpriteAtlas("/sprites/dungeon.png", {
	"hero": {
		"x": 128,
		"y": 196,
		"width": 144,
		"height": 28,
		"sliceX": 9,
		"anims": {
			"idle": {
				"from": 0,
				"to": 3,
				"speed": 3,
				"loop": true,
			},
			"run": {
				"from": 4,
				"to": 7,
				"speed": 10,
				"loop": true,
			},
			"hit": 8,
		},
	},
	"ogre": {
		"x": 16,
		"y": 320,
		"width": 256,
		"height": 32,
		"sliceX": 8,
		"anims": {
			"idle": {
				"from": 0,
				"to": 3,
				"speed": 3,
				"loop": true,
			},
			"run": {
				"from": 4,
				"to": 7,
				"speed": 10,
				"loop": true,
			},
		},
	},
	"floor": {
		"x": 16,
		"y": 64,
		"width": 48,
		"height": 48,
		"sliceX": 3,
		"sliceY": 3,
	},
	"chest": {
		"x": 304,
		"y": 304,
		"width": 48,
		"height": 16,
		"sliceX": 3,
		"anims": {
			"open": {
				"from": 0,
				"to": 2,
				"speed": 20,
				"loop": false,
			},
			"close": {
				"from": 2,
				"to": 0,
				"speed": 20,
				"loop": false,
			},
		},
	},
	"sword": {
		"x": 322,
		"y": 81,
		"width": 12,
		"height": 30,
	},
	"wall": {
		"x": 16,
		"y": 16,
		"width": 16,
		"height": 16,
	},
	"wall_top": {
		"x": 16,
		"y": 0,
		"width": 16,
		"height": 16,
	},
	"wall_left": {
		"x": 16,
		"y": 128,
		"width": 16,
		"height": 16,
	},
	"wall_right": {
		"x": 0,
		"y": 128,
		"width": 16,
		"height": 16,
	},
	"wall_topleft": {
		"x": 32,
		"y": 128,
		"width": 16,
		"height": 16,
	},
	"wall_topright": {
		"x": 48,
		"y": 128,
		"width": 16,
		"height": 16,
	},
	"wall_botleft": {
		"x": 32,
		"y": 144,
		"width": 16,
		"height": 16,
	},
	"wall_botright": {
		"x": 48,
		"y": 144,
		"width": 16,
		"height": 16,
	},
})

// Can also load from external JSON url
// loadSpriteAtlas("/sprites/dungeon.png", "/sprites/dungeon.json")

// floor
addLevel([
	"xxxxxxxxxx",
	"          ",
	"          ",
	"          ",
	"          ",
	"          ",
	"          ",
	"          ",
	"          ",
	"          ",
], {
	width: 16,
	height: 16,
	" ": () => [
		sprite("floor", { frame: ~~rand(0, 8) }),
	],
})

// objects
const map = addLevel([
	"tttttttttt",
	"cwwwwwwwwd",
	"l        r",
	"l        r",
	"l        r",
	"l      $ r",
	"l        r",
	"l $      r",
	"attttttttb",
	"wwwwwwwwww",
], {
	width: 16,
	height: 16,
	"$": () => [
		sprite("chest"),
		area(),
		body({ isStatic: true }),
		{ opened: false },
		"chest",
	],
	"a": () => [
		sprite("wall_botleft"),
		area({ shape: new Rect(vec2(0), 4, 16) }),
		body({ isStatic: true }),
	],
	"b": () => [
		sprite("wall_botright"),
		area({ shape: new Rect(vec2(12, 0), 4, 16) }),
		body({ isStatic: true }),
	],
	"c": () => [
		sprite("wall_topleft"),
		area(),
		body({ isStatic: true }),
	],
	"d": () => [
		sprite("wall_topright"),
		area(),
		body({ isStatic: true }),
	],
	"w": () => [
		sprite("wall"),
		area(),
		body({ isStatic: true }),
	],
	"t": () => [
		sprite("wall_top"),
		area({ shape: new Rect(vec2(0, 12), 16, 4) }),
		body({ isStatic: true }),
	],
	"l": () => [
		sprite("wall_left"),
		area({ shape: new Rect(vec2(0), 4, 16) }),
		body({ isStatic: true }),
	],
	"r": () => [
		sprite("wall_right"),
		area({ shape: new Rect(vec2(12, 0), 4, 16) }),
		body({ isStatic: true }),
	],
})

const player = add([
	pos(map.getPos(2, 2)),
	sprite("hero", { anim: "idle" }),
	area({ shape: new Rect(vec2(0, 6), 12, 12) }),
	body(),
	origin("center"),
])

const ogre = add([
	sprite("ogre"),
	pos(map.getPos(4, 4)),
	origin("bot"),
	area({ scale: 0.5 }),
	body({ isStatic: true }),
])

const sword = add([
	pos(),
	sprite("sword"),
	origin("bot"),
	rotate(0),
	follow(player, vec2(-4, 9)),
	spin(),
])

function spin() {
	let spinning = false
	return {
		id: "spin",
		update() {
			if (spinning) {
				this.angle += 1200 * dt()
				if (this.angle >= 360) {
					this.angle = 0
					spinning = false
				}
			}
		},
		spin() {
			spinning = true
		},
	}
}

onKeyPress("space", () => {
	let interacted = false
	getAll("chest").forEach((c) => {
		if (player.isTouching(c)) {
			if (c.opened) {
				c.play("close")
				c.opened = false
			} else {
				c.play("open")
				c.opened = true
			}
			interacted = true
		}
	})
	if (!interacted) {
		sword.spin()
	}
})

const SPEED = 120

const dirs = {
	"left": LEFT,
	"right": RIGHT,
	"up": UP,
	"down": DOWN,
}

player.onUpdate(() => {
	camPos(player.pos)
})

player.onCollisionResolve(() => {
	// Set the viewport center to player.pos
	camPos(player.pos)
})

onKeyDown("right", () => {
	player.flipX(false)
	sword.flipX(false)
	player.move(SPEED, 0)
	sword.follow.offset = vec2(-4, 9)
})

onKeyDown("left", () => {
	player.flipX(true)
	sword.flipX(true)
	player.move(-SPEED, 0)
	sword.follow.offset = vec2(4, 9)
})

onKeyDown("up", () => {
	player.move(0, -SPEED)
})

onKeyDown("down", () => {
	player.move(0, SPEED)
})

onKeyPress(["left", "right", "up", "down"], () => {
	player.play("run")
})

onKeyRelease(["left", "right", "up", "down"], () => {
	if (
		!isKeyDown("left")
		&& !isKeyDown("right")
		&& !isKeyDown("up")
		&& !isKeyDown("down")
	) {
		player.play("idle")
	}
})
