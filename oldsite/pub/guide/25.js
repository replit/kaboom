// TALK: You see, we spawn a lot of pipes and we're updating and rendering all of them.
// TALK: If they keep piling up it's bad for performance
// TALK: We can solve this easily by just `destroy()` ing them when they're moved off screen
// TALK: Now we can play the game forever and not worry about the game getting slow
// TALK: There's still one problem left: the score is rendered behind the pipes

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

		// destroy if it's out of view
		if (pipe.pos.x < -pipe.width) {
			destroy(pipe);
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
