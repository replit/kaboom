const k = kaboom;
k.init();

k.scene("main", () => {
	k.add([
		k.pos(0, 0),
		k.text("oh hi mark", 24, "topleft"),
	]);
});

k.start("main");

