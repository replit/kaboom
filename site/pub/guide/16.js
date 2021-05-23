// TALK: next, let's make a losing scene instead of restarting the game every time
// TALK: we here define another scene called "gameover" and make falling / collision go here instead
// TALK: and add a keyPress event to go back to main scene again
// TALK: now we can finally get back to a major issue
// TALK: there's only 1 set of pipes! that's not really that fun
// TALK: we gotta make some pipe generation mechanism

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

	action("pipe", (pipe) => {
		pipe.move(-PIPE_SPEED, 0);
	});

});

scene("gameover", () => {

	add([
		text("you lose!", 24),
		pos(width() / 2, height() / 2),
		origin('center'),
	]);

	keyPress("space", () => {
		go("main");
	});

});

start("main");
