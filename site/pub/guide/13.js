// TALK: To do that, we can first give the pipe a `"pipe"` tag
// TALK: Then use the function `collides()` on mark which runs whenever mark collides with another game object with a certain tag
// TALK: In that we put a `debug.log()` which logs a message on screen

kaboom({
	global: true,
	scale: 2,
	fullscreen: true,
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
