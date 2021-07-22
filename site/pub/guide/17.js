// TALK: Like this. Checking for my `y` position to decide if I'm too low
// TALK: Time for game over sound effects.

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

	mark.action(() => {
		if (mark.pos.y >= height() + 24) {
			go("gameover");
		}
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
