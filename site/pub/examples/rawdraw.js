kaboom.global();

init({
	fullscreen: true,
	scale: 2,
});

loadSprite("car", "/pub/img/car.png", {
	sliceX: 3,
});

scene("main", () => {
	render(() => {
		drawSprite("car", {
			pos: vec2(50),
			scale: 3,
			rot: time(),
			frame: ~~time() % 3,
			origin: "center",
		});
		drawRect(vec2(50), 20, 50);
		drawLine(vec2(0), mousePos(), {
			width: 2,
			color: rgba(0, 0, 1, 1),
			z: 0.5,
		});
		drawText("hi", {
			pos: mousePos(),
			size: 64,
		});
	});
});

start("main");
