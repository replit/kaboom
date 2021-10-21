// v2000 launch game

kaboom({
	scale: 0.66,
	background: [ 128, 180, 255 ],
});

loadSprite("bean", "sprites/bean.png");
loadSprite("bag", "sprites/bag.png");
loadSprite("bobo", "sprites/bobo.png");
loadSprite("onion", "sprites/onion.png");
loadSprite("googoly", "sprites/googoly.png");
loadSprite("lamp", "sprites/lamp.png");
loadSprite("goldfly", "sprites/goldfly.png");
loadSprite("gigagantrum", "sprites/gigagantrum.png");
loadSprite("note", "sprites/note.png");
loadSprite("grass", "sprites/grass.png");
loadSprite("cloud", "sprites/cloud.png");
loadSound("bell", "sounds/bell.mp3");
loadSound("kaboom2000", "sounds/kaboom2000.mp3");

const FLOOR_HEIGHT = 64;
const JUMP_FORCE = 1200;
const CAPTION_SPEED = 340;
const PLAYER_SPEED = 640;

let started = false;
let music = null;
let burping = false;

// define gravity
gravity(2400);

// add a game object to screen
const player = add([
	// list of components
	sprite("bean"),
	pos(width() / 2, height() - FLOOR_HEIGHT),
	area(),
	body(),
	origin("bot"),
	z(100),
]);

const size = 160;

for (let i = 0; i < 5; i++) {
	for (let j = 0; j <= i; j++) {
		const n = i * (i + 1) / 2 + j;
		add([
			sprite("note"),
			pos(j * size + 64 + (5 - i) * size / 2, i * 140 + 140),
			area(),
			solid(),
			origin("bot"),
			color(hsl2rgb((n * 20) / 255, 0.6, 0.7)),
			n === 0 ? "burp" : "note",
			{ detune: n * -100 + 200, },
		]);
	}
}

// floor
for (let x = 0; x < width(); x += 64) {
	add([
		pos(x, height()),
		sprite("grass"),
		origin("botleft"),
		area(),
		solid(),
	]);
}

function jump() {
	if (player.grounded()) {
		player.jump(JUMP_FORCE);
	}
}

// jump when user press space
keyPress(["space", "up"], jump);

keyDown("left", () => player.move(-PLAYER_SPEED, 0));
keyDown("right", () => player.move(PLAYER_SPEED, 0));

player.on("headbutt", (block) => {
	if (block.is("note")) {
		play("bell", {
			detune: block.detune,
			volume: 0.2
		});
		addKaboom(block.pos);
		shake(1);
		if (!started) {
			started = true;
			caption.hidden = false;
			caption.paused = false;
			music = play("kaboom2000");
		}
	} else if (block.is("burp")) {
		burp();
		shake(480);
		if (music) music.stop();
		burping = true;
		player.paused = true;
	}
});

action(() => {
	if (!burping) return;
	camPos(camPos().lerp(player.pos, dt() * 3));
	camScale(camScale().lerp(vec2(5), dt() * 3));
});

const lyrics = "kaboom2000 is out today, i have to go and try it out now... oh it's so fun it's so fun it's so fun...... it's so fun it's so fun it's so fun";

const caption = add([
	text(lyrics, {
		transform(idx, ch) {
			return {
				color: hsl2rgb(((time() * 60 + idx * 20) % 255) / 255, 0.7, 0.8),
				scale: wave(1, 1.2, time() * 3 + idx),
				angle: wave(-9, 9, time() * 3 + idx),
			};
		},
	}),
	pos(width(), 20),
	move(LEFT, CAPTION_SPEED),
]);

caption.hidden = true;
caption.paused = true;

const guys = [
	"bag",
	"bobo",
	"onion",
	"googoly",
	"lamp",
	"gigagantrum",
	"goldfly",
];

function funky() {
	let timer = 0;
	return {
		id: "funky",
		require: [ "pos", "rotate", ],
		update() {
			timer += dt();
			this.angle = wave(-9, 9, timer * 4);
		},
	};
}

function spawnCloud() {

	const dir = choose([LEFT, RIGHT]);

	add([
		sprite("cloud", { flipX: dir.eq(LEFT) }),
		move(dir, rand(20, 60)),
		cleanup(),
		pos(dir.eq(LEFT) ? width() : 0, rand(-20, 480)),
		origin("top"),
		area(),
		z(-50),
	]);

	wait(rand(6, 12), spawnCloud);

}

function spawnFriend() {

	const guy = choose(guys);
	const dir = choose([LEFT, RIGHT]);

	add([
		sprite(guy, { flipX: dir.eq(LEFT) }),
		move(dir, rand(120, 320)),
		cleanup(),
		pos(dir.eq(LEFT) ? width() : 0, height() - FLOOR_HEIGHT),
		area(),
		rotate(),
		funky(),
		origin("bot"),
		z(50),
	]);

	wait(rand(1, 3), spawnFriend);

}

spawnCloud();
spawnFriend();
