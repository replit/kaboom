init({
	fullscreen: true,
	scale: 2,
});

loadSprite("car", "/pub/img/car.png");

scene("main", () => {
	render(() => {
		drawSprite("car", {
			pos: vec2(100),
			scale: 3,
			rot: time(),
			frame: 0,
		});
		drawRect(vec2(100), 20, 50);
		drawLine(vec2(0), mousePos(), {
			width: 2,
			color: rgba(0, 0, 1, 1),
			z: 0.5,
		});
		drawText("hi", {
			pos: mousePos(),
			size: 64,
			origin: "topleft",
		});
	});
});

start("main");
