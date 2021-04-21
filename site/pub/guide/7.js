// TALK: let's make it fall
// TALK: the body() component tells kaboom gravity applies to this birdy
// TALK: but we don't want the birdy to keep falling
// TALK: let's make a temporary platform for the bird to stay on

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
		body(),
	]);

});

start("main");
