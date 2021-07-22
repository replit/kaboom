// TALK: Let's spawn a pipe every 2 seconds, with `loop()`
// TALK: Previously we used `pipe.action()` for describing pipe's behavior, now with multiple pipes, we change it to `action("pipe")` so it works for every object with tag `"pipe"`
// TALK: Oh yes and also `rand()` for random `Y` position for each pipe
// TALK: Nice. Now the top row of pipes.

kaboom({
	global: true,
	scale: 2,
	fullscreen: true,
	debug: true,
});

loadSprite("bg", "/assets/sprites/bg.png");
loadSprite("pipe", "/assets/sprites/pipe.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");
loadSound("scream", "/assets/sounds/scream6.mp3");
loadSound("horn", "/assets/sounds/horn2.mp3");
loadSound("horse", "/assets/sounds/horse.mp3");

scene("game", () => {

	play("horse");

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
			play("scream");
			go("gameover");
		}
	});

	loop(2, () => {
		addSprite("pipe", {
			pos: vec2(width(), rand(height(), height() + 120)),
			origin: "botleft",
			tags: [ "pipe" ],
		});
	});

	mark.collides("pipe", () => {
		play("horn");
		go("gameover");
	});

	action("pipe", (pipe) => {
		pipe.move(-60, 0);
	});

	keyPress("space", () => {
		mark.jump();
		play("wooosh");
	});

});

scene("gameover", () => {

	addText("Game Over");

	keyPress("space", () => {
		go("game");
	});

});

go("game");
