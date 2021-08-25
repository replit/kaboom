// tiled sprite

kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

loadRoot("/assets/");
loadSprite("grass", "sprites/grass.png");

add([
	sprite("grass", {
		width: width(),
		height: height(),
		tiled: true,
	}),
]);
