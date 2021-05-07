kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

loadRoot("/pub/examples/");
loadShader("test", null, "shaders/blue.glsl", true);

scene("main", () => {
	add([
		text("ohhimark"),
		pos(100, 100),
		shader("test"),
	]);
});

start("main");
