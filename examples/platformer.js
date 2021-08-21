kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	debug: true,
	clearColor: [0, 0, 0, 1],
});

loadRoot("/pub/examples/");

// See: https://kenney.nl/assets/bit-platformer-pack
loadSprite("tiles", "./tilemaps/bit-platformer.png", {
	sliceX: 20,
	sliceY: 20,
	anims: {
		idle: {from: 300, to: 300},
		run: {from: 301, to: 305},
	},
});

// define some constants
const JUMP_FORCE = 320;
const MOVE_SPEED = 120;
const SCALE = 1.5;

const TILE_W = 16;
const TILE_H = 16;
const WALL = 50;
const FLOOR = 65;
const SIGN_RIGHT = 93;
const SIGN_LEFT = 92;
const PRIZE = 96;

let angle = 0;

// add level to this scene
addLevel([
	"!                                     !",
	"!                                     !",
	"!                                     !",
	"!                         %           !",
	"!                      ====           !",
	"!                                     !",
	"!               ====                  !",
	"!                                     !",
	"!        ====                         !",
	"!                                     !",
	"!  >                               <  !",
	"!=====================================!"
], {
	width: TILE_W,
	height: TILE_H,
	"=": [
		sprite("tiles", {
			frame: FLOOR,
		}),
		area(vec2(0, 0), vec2(TILE_W, 8)),
		solid(),
	],
	"!": [
		sprite("tiles", {
			frame: WALL,
		}),
		area(),
		solid(),
	],
	"<": [
		sprite("tiles", {
			frame: SIGN_LEFT,
		}),
		area(),
		color(0, 1, 0),
		solid(),
	],
	">": [
		sprite("tiles", {
			frame: SIGN_RIGHT,
		}),
		area(),
		color(0, 1, 0),
		solid(),
	],
	"%": [
		sprite("tiles", {
			frame: PRIZE,
		}),
		area(),
		color(1, 0, 0),
		origin("center"),
		rotate(angle++ * Math.PI/4),
		"prize",
	],
});

// define player object
const player = add([
	sprite("tiles", {
		animSpeed: 0.05,
		frame: 300,
	}),
	area(vec2(-4, 0), vec2(4, 8)),
	pos(TILE_W * 6, 0),
	color(0.5, 0.5, 1),
	origin("center"),
	scale(SCALE),
	body(),
]);

// Player starts out as idle animation
player.play("idle");

// If player captures prize, restart level
player.collides("prize", prize => {
	destroy(prize);
});

// jump with space
keyPress("space", () => {
	// these 2 functions are provided by body() component
	if (player.grounded()) {
		player.jump(JUMP_FORCE);
	}
});

// move left
keyDown("left", () => {
	player.move(-MOVE_SPEED, 0);
});

// move right
keyDown("right", () => {
	player.move(MOVE_SPEED, 0);
});

// basic key press logic to change animations
keyPress("left", () => {
	player.scale.x = -SCALE;
	player.play("run");
});

keyPress("right", () => {
	player.scale.x = SCALE;
	player.play("run");
	player.move(MOVE_SPEED, 0);
});

keyRelease(["left", "right"], () => {
	player.play("idle");
});

player.action(() => {
	camPos(player.pos);
});

