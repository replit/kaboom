// TALK: To store custom data on a particular object, we can use the `data` field
// TALK: Then we just put a conditional in the pipe's `action()`, to check every frame if they're left to me and haven't `passed` yet, if yes increment score, flip the switch and update score text
// TALK: Before we learn to pass the score from `"game"` scene to `"gameover"`, we must first solve a crime.

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
			data: {
				passed: false,
			},
		});

	});

	mark.collides("pipe", () => {
		play("horn");
		go("gameover");
	});

	action("pipe", (pipe) => {
		pipe.move(-SPEED, 0);
		if (pipe.passed === false && pipe.pos.x <= mark.pos.x) {
			pipe.passed = true;
			score += 1;
			scoreLabel.text = score;
		}
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
