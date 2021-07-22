// TALK: Define a `"gameover"` scene, and make it `go()` when we hit a pipe
// TALK: Make it go back to `"game"` scene in `"gameover"` on key press for easy replay
// TALK: With this we can also throw away our baby platform, just game over when fall

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
		go("gameover");
	});

	pipe.action(() => {
		pipe.move(-60, 0);
	});

	keyPress("space", () => {
		mark.jump();
		play("wooosh");
	});

});

scene("gameover", () => {

	addText("You lose!");

	keyPress("space", () => {
		go("game");
	});

});

go("game");
