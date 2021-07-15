kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	debug: true,
});

loadRoot("/pub/examples/");
loadSprite("mark", "img/mark.png");

add([
	sprite("mark"),
	// BIGMARK
	scale(10),
]);
