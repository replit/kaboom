// kaboom as pure rendering lib (no component / game obj etc.)

const k = kaboom({
	fullscreen: true,
	scale: 2,
});

k.loadRoot("/pub/examples/");

k.loadSprite("car", "img/car.png", {
	sliceX: 3,
});

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
// 	k.drawTri(k.vec2(100, 100), k.vec2(200, 200), k.mousePos(), {
// 		color: k.rgb(1, 1, 1)
// 	});
});
