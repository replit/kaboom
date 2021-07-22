// TALK: To do that we can use the scene API kaboom provides.
// TALK: All we need to do is take all code we have right now and put them inside a `scene()` block.
// TALK: Then call `go()` to start the scene.
// TALK: With this we can have multiple scenes in our game who are independent to each other. So let's make a game over scene.

kaboom({
	global: true,
	scale: 2,
	fullscreen: true,
	debug: true,
});

loadSprite("bg", "/assets/sprites/bg.png");
loadSprite("pipe", "/assets/sprites/pipe.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");

scene("game", () => {

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

});

go("game");
