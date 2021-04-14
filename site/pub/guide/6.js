// TALK: let's scale the whole canvas up 2x and make it fullscreen!
// TALK: but the birdy still looks weird...
// TALK: it's floating in the air! that's not right!

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
	]);

});

start("main");
