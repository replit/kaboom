// TALK: let's scale the whole canvas up 2x and make it fullscreen!

loadSprite("birdy", "/pub/img/birdy.png");

init({
	fullscreen: true,
	scale: 2,
});

scene("main", () => {
	const birdy = add([
		sprite("birdy"),
		pos(100, 100),
	]);
});

start("main");
