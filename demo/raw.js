const k = kaboom;

k.init();
k.loadSprite("car", "car.png");

k.scene("main", () => {
	k.add([{
		draw() {
			k.drawSprite("car", {
				pos: k.vec2(-60, 30),
				scale: 3,
			});
			k.drawRect(k.vec2(100), 20, 50);
			k.drawLine(k.vec2(0), k.mousePos(), {
				width: 2,
				color: k.rgba(0, 0, 1, 1),
				z: 0.5,
			});
			k.drawText("hi", {
				pos: k.vec2(-120),
				size: 64,
			});
		},
	}]);
});

k.start("main");

