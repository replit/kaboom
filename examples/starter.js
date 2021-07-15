kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	debug: true,
});

loadRoot("/assets/");
loadSprite("mark", "sprites/mark.png");

addSprite("mark", {
	pos: vec2(100, 100),
	scale: 3,
	origin: "center",
});

addRect(100, 100, {
	pos: vec2(100, 200),
});
