kaboom({
	scale: 4,
	clearColor: [0, 0, 0],
});

loadSpriteAtlas("sprites/dungeon.png", {
	"hero": {
		x: 128,
		y: 68,
		width: 16 * 9,
		height: 28,
		sliceX: 9,
		anims: {
			idle: { from: 0, to: 3 },
			run: { from: 4, to: 7 },
			hit: { from: 8, to: 8 },
		},
	},
	"floor": {
		x: 16,
		y: 64,
		width: 16 * 3,
		height: 16 * 3,
		sliceX: 3,
		sliceY: 3,
	},
	"chest": {
		x: 304,
		y: 304,
		width: 16 * 3,
		height: 16,
		sliceX: 3,
		anims: {
			open: { from: 0, to: 2, },
			close: { from: 0, to: 0, },
		},
	},
	"sword": {
		x: 322,
		y: 81,
		width: 12,
		height: 30,
	},
	"wall": {
		x: 16,
		y: 16,
		width: 16,
		height: 16,
	},
	"wall_top": {
		x: 16,
		y: 0,
		width: 16,
		height: 16,
	},
	"wall_left": {
		x: 16,
		y: 128,
		width: 16,
		height: 16,
	},
	"wall_right": {
		x: 0,
		y: 128,
		width: 16,
		height: 16,
	},
	"wall_topleft": {
		x: 32,
		y: 128,
		width: 16,
		height: 16,
	},
	"wall_topright": {
		x: 48,
		y: 128,
		width: 16,
		height: 16,
	},
	"wall_botleft": {
		x: 32,
		y: 144,
		width: 16,
		height: 16,
	},
	"wall_botright": {
		x: 48,
		y: 144,
		width: 16,
		height: 16,
	},
});

addLevel([
	"xxxxxxxxxxx",
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
});

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
		solid(),
		{ opened: false, },
		"chest",
	],
	"a": [
		sprite("wall_botleft"),
		area({ width: 4 }),
		solid(),
	],
	"b": [
		sprite("wall_botright"),
		area({ width: 4, offset: vec2(12, 0) }),
		solid(),
	],
	"c": [
		sprite("wall_topleft"),
		area(),
		solid(),
	],
	"d": [
		sprite("wall_topright"),
		area(),
		solid(),
	],
	"w": [
		sprite("wall"),
		area(),
		solid(),
	],
	"t": [
		sprite("wall_top"),
		area({ height: 4, offset: vec2(0, 12) }),
		solid(),
	],
	"l": [
		sprite("wall_left"),
		area({ width: 4, }),
		solid(),
	],
	"r": [
		sprite("wall_right"),
		area({ width: 4, offset: vec2(12, 0) }),
		solid(),
	],
});

const player = add([
	pos(map.getPos(2, 2)),
	sprite("hero"),
	area({ width: 12, height: 12, offset: vec2(0, 6) }),
	solid(),
	origin("center"),
]);

const sword = add([
	pos(),
	sprite("sword"),
	origin("bot"),
	rotate(0),
	follow(player, vec2(-4, 9)),
	spin(),
]);

function spin() {
	let spinning = false;
	return {
		id: "spin",
		update() {
			if (spinning) {
				this.angle -= 1200 * dt();
				if (this.angle <= -360) {
					this.angle = 0;
					spinning = false;
				}
			}
		},
		spin() {
			spinning = true;
		},
	};
}

keyPress("space", () => {
	let interacted = false;
	every("chest", (c) => {
		if (player.isCollided(c)) {
			if (c.opened) {
				c.play("close", false);
				c.opened = false;
			} else {
				c.play("open", false);
				c.opened = true;
			}
			interacted = true;
		}
	});
	if (!interacted) {
		sword.spin();
	}
});

player.animSpeed = 0.3;
player.play("idle");

const SPEED = 120;

const dirs = {
	"left": LEFT,
	"right": RIGHT,
	"up": UP,
	"down": DOWN,
};

player.action(() => {
	camPos(player.pos);
});

keyDown("right", () => {
	player.flipX(false);
	sword.flipX(false);
	player.move(SPEED, 0);
	sword.follow.offset = vec2(-4, 9);
});

keyDown("left", () => {
	player.flipX(true);
	sword.flipX(true);
	player.move(-SPEED, 0);
	sword.follow.offset = vec2(4, 9);
});

keyDown("up", () => {
	player.move(0, -SPEED);
});

keyDown("down", () => {
	player.move(0, SPEED);
});

keyPress(["left", "right", "up", "down"], () => {
	player.play("run");
	player.animSpeed = 0.1;
});

keyRelease(["left", "right", "up", "down"], () => {
	if (
		!keyIsDown("left")
		&& !keyIsDown("right")
		&& !keyIsDown("up")
		&& !keyIsDown("down")
	) {
		player.play("idle");
		player.animSpeed = 0.3;
	}
});
