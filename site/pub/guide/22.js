// TALK: let's use layers() to define layers and their orders
// TALK: the second argument is the default layer
// TALK: and we use layer() component to make object appear on a non default layer
// TALK: almost complete! now let's pass the score to the game over screen

kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

loadRoot("/pub/examples/");
loadSprite("birdy", "img/birdy.png");
loadSprite("bg", "img/bg.png");
loadSprite("pipe", "img/pipe.png");

scene("main", () => {

	layers([
		"game",
		"ui",
	], "game");

	add([
		sprite("bg"),
		// TODO: query sprite size
		scale(width() / 240, height() / 240),
		origin("topleft"),
	]);

	const birdy = add([
		sprite("birdy"),
		pos(80, 80),
		body(),
	]);

	const JUMP_FORCE = 320;

	keyPress("space", () => {
		birdy.jump(JUMP_FORCE);
	});

	birdy.action(() => {
		if (birdy.pos.y >= height()) {
			go("gameover");
		}
	});

	birdy.collides("pipe", () => {
		go("gameover");
	});

	const PIPE_OPEN = 120;
	const PIPE_SPEED = 90;

	loop(1.5, () => {

		const pipePos = rand(0, height() - PIPE_OPEN);

		add([
			sprite("pipe"),
			origin("bot"),
			pos(width(), pipePos),
			"pipe",
		]);

		add([
			sprite("pipe"),
			pos(width(), pipePos + PIPE_OPEN),
			scale(1, -1),
			origin("bot"),
			"pipe",
			{ passed: false, },
		]);

	});

	action("pipe", (pipe) => {

		pipe.move(-PIPE_SPEED, 0);

		if (pipe.pos.x + pipe.width <= birdy.pos.x && pipe.passed === false) {
			score.value++;
			score.text = score.value;
			pipe.passed = true;
		}

		if (pipe.pos.x + pipe.width < 0) {
			destroy(pipe);
		}

	});

	const score = add([
		pos(12, 12),
		text("0", 32),
		layer("ui"),
		{
			value: 0,
		},
	]);

});

scene("gameover", () => {

	add([
		text("you lose!", 24),
		pos(width() / 2, height() / 2),
		origin("center"),
	]);

	keyPress("space", () => {
		go("main");
	});

});

start("main");
