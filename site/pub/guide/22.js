// TALK: To store custom data on a particular object, we just pass in a plain object into the component list
// TALK: Then we just put a conditional in the pipe's `action()`, to check every frame if they're left to me and haven't `passed` yet, if yes increment score, flip the switch and update score text
// TALK: Before we learn how to pass the score from `"game"` scene to `"lose"` scene, there's one big problem.

kaboom({
	global: true,
	debug: true,
	fullscreen: true,
	scale: 2,
});

loadSprite("mark", "/assets/sprites/mark.png");
loadSprite("bg", "/assets/sprites/bg.png");
loadSprite("pipe", "/assets/sprites/pipe.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");
loadSound("scream", "/assets/sounds/scream6.mp3");
loadSound("horn", "/assets/sounds/horn2.mp3");
loadSound("horse", "/assets/sounds/horse.mp3");

scene("game", () => {

	const PIPE_MARGIN = 40;
	const PIPE_OPEN = 120;
	const SPEED = 120;
	const JUMP_FORCE = 320;

	gravity(1200);

	// play("horse");

	// background
	add([
		sprite("bg", { width: width(), height: height(), }),
	]);

	// player
	const player = add([
		sprite("mark"),
		pos(80, 80),
		area(),
		body(),
	]);

	let score = 0;

	const scoreLabel = add([
		text(score, 32),
		pos(12, 12),
	]);

	loop(1, () => {

		const center = rand(
			PIPE_MARGIN + PIPE_OPEN / 2,
			height() - PIPE_MARGIN - PIPE_OPEN / 2
		);

		add([
			sprite("pipe", { flipY: true }),
			pos(width(), center - PIPE_OPEN / 2),
			origin("botleft"),
			area(),
			"pipe",
		]);

		add([
			sprite("pipe"),
			pos(width(), center + PIPE_OPEN / 2),
			area(),
			"pipe",
			{ passed: false, }
		]);

	});

	keyPress("space", () => {
		player.jump(JUMP_FORCE);
		play("wooosh");
	});

	action("pipe", (pipe) => {

		pipe.move(-SPEED, 0);

		// increment score if pipe move pass the player
		if (pipe.passed === false && pipe.pos.x < player.pos.x) {
			pipe.passed = true;
			score += 1;
			scoreLabel.text = score;
		}

	});

	player.collides("pipe", () => {
		go("lose");
		play("horn");
	});

	player.action(() => {
		if (player.pos.y > height()) {
			go("lose");
			// play("scream");
		}
	});

});

scene("lose", () => {

	add([
		text("Game over"),
	]);

	keyPress("space", () => {
		go("game");
	});

});

go("game");
