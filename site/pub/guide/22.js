// TALK: First let's add the score label object, and a variable that represents the score number
// TALK: So how can we detect if I have gone past a pipe and got a score?
// TALK: We can store a boolean on each pipe to keep track of if I have moved passed the pipe, so we can tell if I did it for the first time

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

	const PIPE_MARGIN = 80;
	const PIPE_OPEN = 120;
	const SPEED = 120;
	const JUMP_FORCE = 320;

	gravity(1200);

	play("horse");

	addSprite("bg", {
		width: width(),
		height: height(),
	});

	let score = 0;

	const scoreLabel = addText(score, 32, {
		pos: vec2(12, 12),
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

	loop(1, () => {

		const y = rand(PIPE_MARGIN, height() - PIPE_MARGIN);

		addSprite("pipe", {
			flipY: true,
			pos: vec2(width(), y - PIPE_OPEN / 2),
			origin: "botleft",
			tags: [ "pipe" ],
		});

		addSprite("pipe", {
			pos: vec2(width(), y + PIPE_OPEN / 2),
			origin: "topleft",
			tags: [ "pipe" ],
		});

	});

	mark.collides("pipe", () => {
		play("horn");
		go("gameover");
	});

	action("pipe", (pipe) => {
		pipe.move(-SPEED, 0);
	});

	keyPress("space", () => {
		mark.jump(JUMP_FORCE);
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
