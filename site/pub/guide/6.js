// TALK: let's scale the whole canvas up 2x and make it fullscreen!
// TALK: but the birdy still looks weird...
// TALK: it's floating in the air! that's not right!

kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

loadRoot("/pub/examples/");
loadSprite("birdy", "img/birdy.png");

scene("main", () => {

	const birdy = add([
		sprite("birdy"),
		pos(80, 80),
	]);

});

start("main");
