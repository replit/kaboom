const k = kaboom;

k.init();
k.loadSprite("guy", "guy.png");

k.scene("main", () => {
	k.add([{
		draw() {
			k.drawSprite("guy", {
				pos: k.vec2(-60, 30),
			});
			k.drawRect(k.vec2(100), 20, 50);
			k.drawLine(k.vec2(0), k.mousePos(), {
				width: 2,
			});
			k.drawText("h", {
				pos: k.vec2(-120),
				size: 64,
			});
		},
	}]);
});

k.start("main");

