kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

scene("main", () => {
	add([
		text("ohhimark"),
		pos(100, 100),
	]);
});

start("main");
