// TALK: try hitting that space button!

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

	keyPress("space", () => {
		birdy.jump();
	});

	add([
		rect(width(), 12),
		pos(0, 280),
		origin("topleft"),
		solid(),
	]);

});

start("main");
