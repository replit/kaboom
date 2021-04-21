// TALK: then we give it a pos(100, 100) component to tell what position to draw on screen
// TALK: oops it looks like our birdy is too small

kaboom({
	global: true,
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
