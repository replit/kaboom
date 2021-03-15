// TALK: scale it to fit the whole screen
// TALK: and make the image origin point top left (it defaults to center, so you only see 1/4 of it before)

loadSprite("bg", "/pub/img/bg.png");
loadSprite("birdy", "/pub/img/birdy.png");

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
