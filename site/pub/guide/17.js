// TALK: we can use the loop() function, to add new pipes to the scene every 1.5 seconds!
// TALK: we just move the pipe add() functions into the loop() callback
// TALK: but you may have noticed all pipes have the same position which is no fun
// TALK: gotta make those random man

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

		add([
			sprite("pipe"),
			origin("bot"),
			pos(width(), 120),
			"pipe",
		]);

		add([
			sprite("pipe"),
			pos(width(), 120 + PIPE_OPEN),
			scale(1, -1),
			origin("bot"),
			"pipe",
		]);

	});

	action("pipe", (pipe) => {
		pipe.move(-PIPE_SPEED, 0);
	});

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
