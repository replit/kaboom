kaboom({
	scale: 4,
	clearColor: [0, 0, 0],
});

// go to https://kaboomjs.com/sprites/dungeon.json to see the atlas format
loadSpriteAtlas("sprites/dungeon.png", "sprites/dungeon.json");

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
});

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
		solid(),
		{ opened: false, },
		"chest",
	],
	"a": () => [
		sprite("wall_botleft"),
		area({ width: 4 }),
		solid(),
	],
	"b": () => [
		sprite("wall_botright"),
		area({ width: 4, offset: vec2(12, 0) }),
		solid(),
	],
	"c": () => [
		sprite("wall_topleft"),
		area(),
		solid(),
	],
	"d": () => [
		sprite("wall_topright"),
		area(),
		solid(),
	],
	"w": () => [
		sprite("wall"),
		area(),
		solid(),
	],
	"t": () => [
		sprite("wall_top"),
		area({ height: 4, offset: vec2(0, 12) }),
		solid(),
	],
	"l": () => [
		sprite("wall_left"),
		area({ width: 4, }),
		solid(),
	],
	"r": () => [
		sprite("wall_right"),
		area({ width: 4, offset: vec2(12, 0) }),
		solid(),
	],
});

const player = add([
	pos(map.getPos(2, 2)),
	sprite("hero", { anim: "idle" }),
	area({ width: 12, height: 12, offset: vec2(0, 6) }),
	solid(),
	origin("center"),
]);

const ogre = add([
	sprite("ogre"),
	pos(map.getPos(4, 4)),
	origin("bot"),
	area({ scale: 0.5 }),
	solid(),
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
				this.angle += 1200 * dt();
				if (this.angle >= 360) {
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
		if (player.isTouching(c)) {
			if (c.opened) {
				c.play("close");
				c.opened = false;
			} else {
				c.play("open");
				c.opened = true;
			}
			interacted = true;
		}
	});
	if (!interacted) {
		sword.spin();
	}
});

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
});

keyRelease(["left", "right", "up", "down"], () => {
	if (
		!keyIsDown("left")
		&& !keyIsDown("right")
		&& !keyIsDown("up")
		&& !keyIsDown("down")
	) {
		player.play("idle");
	}
});
