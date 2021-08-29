// TALK: Extremely easy to pass the score to `"lose"` scene to display it
// TALK: Just need to pass it as arg to `go()` and pick it up there
// TALK: Let's also take this chance to make the game over screen look nicer, by giving a black background color and making stuff centered
// TALK: There you go. Game basically done.
// TALK: Except...
// TALK: It NOT!

kaboom({
	global: true,
	debug: true,
	fullscreen: true,
	scale: 2,
	clearColor: [ 0, 0, 0, 1 ],
});

loadSprite("mark", "/assets/sprites/mark.png");
loadSprite("bg", "/assets/sprites/bg.png");
loadSprite("pipe", "/assets/sprites/pipe.png");
loadSound("wooosh", "/assets/sounds/wooosh.mp3");
loadSound("scream", "/assets/sounds/scream6.mp3");
loadSound("horn", "/assets/sounds/horn2.mp3");
loadSound("horse", "/assets/sounds/horse.mp3");
loadSound("blip", "/assets/sounds/blip1.mp3");

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
			play("blip");
		}

	});

	player.collides("pipe", () => {
		go("lose", score);
		play("horn");
	});

	player.action(() => {
		if (player.pos.y > height()) {
			go("lose", score);
			// play("scream");
		}
	});

});

scene("lose", (score) => {

	add([
		text(score, 64),
		pos(center()),
		origin("center"),
	]);

	keyPress("space", () => {
		go("game");
	});

});

go("game");
