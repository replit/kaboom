// TALK: You see, we spawn a lot of pipes, but we never collect the ones that are moved way out of the screen
// TALK: If pipes keep piling up on that, that might be bad for traffic (performance)
// TALK: We can solve this easily by just `destroy()` ing them when they're moved off screen
// TALK: Now we can play the game forever and not worry about the game getting slow (it probably still will... depending on the browser's mood)
// TALK: We're pretty much done with the basics, please stay if you're interested in learning more about kaboom

kaboom({
	global: true,
	scale: 2,
	fullscreen: true,
	debug: true,
	clearColor: [ 0, 0, 0, 1 ],
});

loadSprite("bg", "/assets/sprites/bg.png");
loadSprite("pipe", "/assets/sprites/pipe.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");
loadSound("scream", "/assets/sounds/scream6.mp3");
loadSound("horn", "/assets/sounds/horn2.mp3");
loadSound("horse", "/assets/sounds/horse.mp3");
loadSound("whizz", "/assets/sounds/whizz.mp3");

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
			go("gameover", score);
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
		go("gameover", score);
	});

	action("pipe", (pipe) => {
		pipe.move(-SPEED, 0);
		if (pipe.passed === false && pipe.pos.x <= mark.pos.x) {
			pipe.passed = true;
			score += 1;
			scoreLabel.text = score;
			play("whizz");
		}
		if (pipe.pos.x <= -120) {
			destroy(pipe);
		}
	});

	keyPress("space", () => {
		mark.jump(JUMP_FORCE);
		play("wooosh");
	});

});

scene("gameover", (score) => {

	addText("Game Over", 16, {
		pos: vec2(width() / 2, 120),
		origin: "center",
	});

	addText(score, 48, {
		pos: vec2(width() / 2, 180),
		origin: "center",
	});

	keyPress("space", () => {
		go("game");
	});

});

go("game");
