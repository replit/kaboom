// tiled sprite

kaboom();

loadSprite("steep", "sprites/steel.png");

add([
	sprite("steep", {
		width: width(),
		height: height(),
		tiled: true,
	}),
]);
