// TALK: to accomplish this, we are going to use one of the core function of kaboom: action()
// TALK: first we give 2 pipes "pipe" tags, by giving direct strings to the component list
// TALK: then we use action("pipe", ...) to give all objects with tag "pipe" something to run every frame
// TALK: in this case we make them move left every frame by PIPE_SPEED
// TALK: now we have moving pipes, let's complete this mechanism by making the bird actually have to jump over it!

kaboom.global();

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

	add([
		rect(width(), 12),
		pos(0, 280),
		origin("topleft"),
		solid(),
	]);

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
