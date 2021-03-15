// TALK: let's make it fall
// TALK: the body() component tells kaboom this birdy applies to gravity
// TALK: but we don't want the birdy to keep falling
// TALK: let's make a temporary platform for the bird to stay on

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

});

start("main");
