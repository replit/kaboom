// TALK: Like `loadSound()`, we use `loadSprite()` to load the background image
// TALK: Then another `addSprite()` to add that to the scene
// TALK: We put it before adding the other sprites because we want it to be drawn first, so it'll be on the background
// TALK: You might have noticed things are a bit small, let's deal with that then.

kaboom({
	global: true,
	debug: true,
});

loadSprite("mark", "/assets/sprites/mark.png");
loadSprite("bg", "/assets/sprites/bg.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");

// background
add([
	sprite("bg"),
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

keyPress("space", () => {
	player.jump();
	play("wooosh");
});
