// TALK: then we make the game also restart if birdy collides with the pipes
// TALK: we do this by calling birdy.collides() which checks for collision between birdy and all objects with a certain tag
// TALK: then we have our basic mechanics!

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
			go("main");
		}
	});

	birdy.collides("pipe", () => {
		go("main");
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

start("main");
