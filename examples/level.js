// initialize context
kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	debug: true,
	clearColor: [0, 0, 0, 1],
// 	connect: "ws://localhost:7000",
});

// load assets
loadRoot("/pub/examples/");
loadAseprite("car", "img/car.png", "img/car.json");
loadSprite("steel", "img/steel.png");
loadSprite("grass", "img/grass.png");
loadSprite("jumpy", "img/jumpy.png");
loadSprite("spike", "img/spike.png");
loadSprite("coin", "img/coin.png");
loadSound("coin", "sounds/coin.mp3");

// set gravity
gravity(980);

// "ui" layer will be rendered on top, with "game" being the default layer
layers([
	"game",
	"ui",
], "game");

// camera won't affect "ui" layer
camIgnore([ "ui", ]);

// add game objects using this layout
const map = addLevel([
	"                         ",
	"                         ",
	"          ooo            ",
	"     ^+++====+=          ",
	"                         ",
	"                         ",
	"                         ",
	"                         ",
	"               =++===    ",
	"                         ",
	"                    oo   ",
	"        =====      +++ **",
	"==========++===+=^====+++",
], {
	// grid size will be 11x11
	width: 11,
	height: 11,
	// the topleft position of the whole level
	pos: vec2(0, 0),
	// defining what each symbol means (what components they consists of)
	// they take a list of components, don't call add() here
	"+": [
		sprite("steel"),
		area(),
		solid(),
	],
	"=": [
		sprite("grass"),
		area(),
		solid(),
	],
	"^": [
		sprite("jumpy"),
		area(),
		solid(),
		"jumpy",
	],
	"*": [
		sprite("spike"),
		body(),
		area(vec2(0, 6), vec2(11, 11)),
		"hurt",
	],
	// if you need any dynamic evaluation, can pass a function that returns the
	// comp list (don't actually have any in this case)
	"o": () => {
		return [
			sprite("coin"),
			area(),
			body(),
			"coin",
		];
	},
});

// add our player game obj
const player = add([
	// renders as a sprite
	sprite("car"),
	// has collider
	area(),
	// has position
	pos(map.getPos(1, 0)),
	// has scale
	scale(1),
	// has physical body that can fall and jump
	body({ jumpForce: 320, }),
	// sprite origin to center instead of top left
	origin("center"),
	// custom data
	{ speed: 160, },
]);

// center camera to player
player.action(() => {
	camPos(player.pos);
});

// trigger a big jump when player collide with a special tile
// TODO: only jump when touch on bottom edge
player.collides("jumpy", () => {
	player.jump(player.jumpForce * 2);
});

player.collides("hurt", () => {
	respawn();
});

player.collides("coin", (c) => {
	destroy(c);
	play("coin");
	score.value += 1;
	score.text = score.value;
});

// binding some inputs
keyPress("space", () => {
	if (player.grounded()) {
		player.jump(player.jumpForce);
	}
});

keyDown(["left", "right"], () => {
	if (player.grounded() && player.curAnim() !== "move") {
		player.play("move");
	}
});

keyRelease(["left", "right"], () => {
	if (!keyIsDown("right") && !keyIsDown("left")) {
		player.play("idle");
	}
});

keyDown("left", () => {
	player.flipX(true);
	player.move(-player.speed, 0);
});

keyDown("right", () => {
	player.flipX(false);
	player.move(player.speed, 0);
});

keyDown("up", () => {
	camScale(camScale().add(vec2(dt())));
});

keyDown("down", () => {
	camScale(camScale().sub(vec2(dt())));
});

function respawn() {
	player.pos = vec2(0, 0);
}

player.action(() => {
	if (player.pos.y >= 320) {
		respawn();
	}
});

// score counter will be on the "ui" layer and not affected by camera
const score = add([
	text(0),
	pos(12, 12),
	layer("ui"),
	{ value: 0, },
]);
