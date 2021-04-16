// TALK: as usual we load the sprite, and add 2 pipe objects to the right side of the screen
// TALK: we scale the second one to scale(1, -1) to invert it on the Y axis
// TALK: we use a const PIPE_OPEN to define the distance between 2 pipes, we give it a generous 120 for now
// TALK: next, we'll make the core mechanism of the game: make the pipe move towards the player (yes in flappy birds it's the pipes moving not the bird!)

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

	add([
		sprite("pipe"),
		origin("bot"),
		pos(width(), 120),
	]);

	add([
		sprite("pipe"),
		pos(width(), 120 + PIPE_OPEN),
		scale(1, -1),
		origin("bot"),
	]);

});

start("main");
