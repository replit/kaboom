// TALK: next let's make a losing scene instead of restarting the game every time
// TALK: we here define another scene called "gameover" and make falling / collision go here instead
// TALK: and add a keyPress event to go back to main scene again

loadSprite("bg", "/pub/img/bg.png");
loadSprite("birdy", "/pub/img/birdy.png");
loadSprite("pipe", "/pub/img/pipe.png");

init({
	fullscreen: true,
	scale: 2,
});

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
	const PIPE_SPEED = 60;

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
	]);

	keyPress("space", () => {
		go("main");
	});

});

start("main");
