// TALK: We do that by calling `layers()`
// TALK: it accepts a list with its first item being on the msot background, and last item being on the most foreground
// TALK: the second argument is the default layer, so every object we `add()` will be on that layer, unless we use the explicit `layer()` component.
// TALK: In this case we made `"game"` layer default, so I'll want to add a `layer("ui")` to the text label
// TALK: Not sure if you can survive that long but now our score label is always on top of everything

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

	layers([
		"game",
		"ui",
	], "game");

	play("horse");

	add([
		sprite("bg", {
			width: width(),
			height: height(),
		}),
	]);

	let score = 0;

	const scoreLabel = add([
		text(score, 32),
		pos(12, 12),
		layer("ui"),
	]);

	const mark = add([
		sprite("mark"),
		pos(80, 80),
		body(),
	]);

	mark.action(() => {
		if (mark.pos.y >= height() + 24) {
			play("scream");
			go("gameover", score);
		}
	});

	loop(1, () => {

		const y = rand(PIPE_MARGIN, height() - PIPE_MARGIN);

		add([
			sprite("pipe", { flipY: true, }),
			pos(width(), y - PIPE_OPEN / 2),
			origin("botleft"),
			"pipe",
		]);

		add([
			sprite("pipe"),
			pos(width(), y + PIPE_OPEN / 2),
			origin("topleft"),
			"pipe",
			{ passed: false, },
		]);

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

	add([
		text("Game Over", 16),
		pos(width() / 2, 120),
		origin("center"),
	]);

	add([
		text(score, 48),
		pos(width() / 2, 180),
		origin("center"),
	]);


	keyPress("space", () => {
		go("game");
	});

});

go("game");
