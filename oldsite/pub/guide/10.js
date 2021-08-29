// TALK: Hell yeah
// TALK: That's a fine piece of pipe
// TALK: It really make me want to jump over it again and again
// TALK: Can't do that unless we make it move

kaboom({
	global: true,
	debug: true,
	fullscreen: true,
	scale: 2,
});

loadSprite("mark", "/assets/sprites/mark.png");
loadSprite("bg", "/assets/sprites/bg.png");
loadSprite("pipe", "/assets/sprites/pipe.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");

// background
add([
	sprite("bg", { width: width(), height: height(), }),
]);

// player
const player = add([
	sprite("mark"),
	pos(80, 80),
	area(),
	body(),
]);

// platform
add([
	rect(width(), 20),
	pos(0, height() - 40),
	area(),
	solid(),
]);

// pipe
add([
	sprite("pipe"),
]);

keyPress("space", () => {
	player.jump();
	play("wooosh");
});
