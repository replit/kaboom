kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

loadRoot("/pub/examples/");
loadSprite("mark", "img/mark.png");

scene("main", () => {
	layers([
		"game",
		"ui",
	], "game");
	add([
		sprite("mark"),
		scale(10),
		layer("ui"),
		color(0, 0, 1),
	]);
	add([
		sprite("mark"),
		pos(100, 100),
		scale(10),
	]);
});

start("main");
