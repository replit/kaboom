const k = kaboom;

k.init();
k.loadRoot("res/");
k.loadSprite("car", "car.png");

k.scene("main", () => {
	k.render(() => {
		k.drawSprite("car", {
			pos: k.vec2(100),
			scale: 3,
			rot: k.time(),
			frame: 0,
		});
		k.drawRect(k.vec2(100), 20, 50);
		k.drawLine(k.vec2(0), k.mousePos(), {
			width: 2,
			color: k.rgba(0, 0, 1, 1),
			z: 0.5,
		});
		k.drawText("hi", {
			pos: k.mousePos(),
			size: 64,
			origin: "topleft",
		});
	});
});

k.start("main");

