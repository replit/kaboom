// TALK: The cause is we're `add()` ing pipes after the score lable is `add()` ed. By default objects added later will appear on the top.
// TALK: We can solve this by using the layer system
// TALK: Define layers with `layers()`, we only need 2 layers here, a game layer and a UI layer, the second argument is the default layer.
// TALK: To specify a game obj belongs to a certain layer, we use the `layer()` component. We only need to do this on the score label because we made `"game"` the default layer, so everything else will be on `"game"`.

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

	// define layers and the default layer
	layers([
		"game",
		"ui",
	], "game");

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
		layer("ui"),
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
