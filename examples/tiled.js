kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

loadRoot("/assets/");
loadSprite("grass", "sprites/grass.png");

scene("main", () => {
	add([
		sprite("grass", {
			width: width(),
			height: height(),
			tiled: true,
		}),
	]);
});

start("main");
