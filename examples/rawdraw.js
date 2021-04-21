const k = kaboom({
	fullscreen: true,
	scale: 2,
});

k.loadRoot("/pub/examples/");

k.loadSprite("car", "img/car.png", {
	sliceX: 3,
});

k.scene("main", () => {
	k.render(() => {
		k.drawSprite("car", {
			pos: k.vec2(50),
			scale: 3,
			rot: k.time(),
			frame: ~~k.time() % 3,
			origin: "center",
		});
		k.drawRect(k.vec2(50), 20, 50);
		k.drawLine(k.vec2(0), k.mousePos(), {
			width: 2,
			color: k.rgba(0, 0, 1, 1),
			z: 0.5,
		});
		k.drawText("hi", {
			pos: k.mousePos(),
			size: 64,
		});
	});
});

k.start("main");
