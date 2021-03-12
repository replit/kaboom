init({
	fullscreen: true,
	scale: 2,
});

// gotta load the image first
loadSprite("mark", "/pub/img/mark.png");

scene("main", () => {
	add([
		sprite("mark"),
		// make it center on screen
		pos(width() / 2, height() / 2),
		// BIGMARK
		scale(10),
	]);
});

start("main");
