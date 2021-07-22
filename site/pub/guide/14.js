// TALK: Here's a handy thing we can do. Add a `debug` property to `kaboom()`
// TALK: Now try pressing `F1`, you can toggle the game to draw bounding boxes of everything with area
// TALK: You can also hover over in game objects to inspect some of their properties in real time
// TALK: There's also other interesting debug utilities, e.g.
// TALK: `F8` to pause / unpause, `F7` and `F9` to slow down / pace up time, `F10` to step to next frame while pausing
// TALK: Now let's get back to the game and add a lose scene if player hits a pipe.

kaboom({
	global: true,
	scale: 2,
	fullscreen: true,
	debug: true,
});

loadSprite("bg", "/assets/sprites/bg.png");
loadSprite("pipe", "/assets/sprites/pipe.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");

addSprite("bg", {
	width: width(),
	height: height(),
});

const mark = addSprite("mark", {
	pos: vec2(80, 80),
	body: true,
});

addRect(width(), 20, {
	pos: vec2(0, height() - 40),
	solid: true,
});

const pipe = addSprite("pipe", {
	pos: vec2(width(), height()),
	origin: "botleft",
	tags: [ "pipe" ],
});

mark.collides("pipe", () => {
	debug.log("oh ho!");
});

pipe.action(() => {
	pipe.move(-60, 0);
});

keyPress("space", () => {
	mark.jump();
	play("wooosh");
});
