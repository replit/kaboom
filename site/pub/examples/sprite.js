init({
	fullscreen: true,
	scale: 2,
});

// gotta load the image first
loadSprite("mark", "/pub/img/mark.png");

scene("main", () => {
	add([
		sprite("mark"),
		// BIGMARK
		scale(10),
	]);
	keyPress("f1", () => {
		kaboom.debug.showArea = !kaboom.debug.showArea;
		kaboom.debug.hoverInfo = !kaboom.debug.hoverInfo;
	});
});

start("main");
