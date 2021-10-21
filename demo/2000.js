// v2000 launch game

kaboom();

loadSprite("bean", "sprites/bean.png");
loadSprite("jumpy", "sprites/jumpy.png");
loadSprite("grass", "sprites/grass.png");
loadSound("score", "sounds/score.mp3");
loadSound("kaboom2000", "sounds/kaboom2000.mp3");

const FLOOR_HEIGHT = 64;
const JUMP_FORCE = 1800;
const CAPTION_SPEED = 340;
const PLAYER_SPEED = 640;

let started = false;

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
]);

for (let i = 0; i < 12; i++) {
	add([
		sprite("jumpy"),
		pos(i * 64, height() - FLOOR_HEIGHT - 160),
		area(),
		solid(),
		origin("bot"),
		"note",
		{ detune: i * 100 - 400, },
	]);
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
keyPress("space", jump);
mouseClick(jump);

keyDown("left", () => player.move(-PLAYER_SPEED, 0));
keyDown("right", () => player.move(PLAYER_SPEED, 0));

player.on("headbutt", (block) => {
	if (block.is("note")) {
		play("score", { detune: block.detune });
		addKaboom(block.pos);
		if (!started) {
			started = true;
			caption.hidden = false;
			caption.paused = false;
			play("kaboom2000");
		}
	}
});

const lyrics = "kaboom2000 is out today, i have to go and try it out now... oh it's so fun it's so fun it's so fun...... it's so fun it's so fun it's so fun";

const caption = add([
	text(lyrics),
	pos(width(), 20),
	move(LEFT, CAPTION_SPEED),
]);

caption.hidden = true;
caption.paused = true;
