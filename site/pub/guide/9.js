// TALK: try hitting that space button!
// TALK: we register a keyPress event that gets called everytime the player presses the "space" key
// TALK: then we call method jump() provided by body() component to make it jump

kaboom.global();

loadSprite("birdy", "/pub/img/birdy.png");

init({
	fullscreen: true,
	scale: 2,
});

scene("main", () => {

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

});

start("main");
