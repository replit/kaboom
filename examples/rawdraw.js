// kaboom as pure rendering lib (no component / game obj etc.)

kaboom({
	fullscreen: true,
	scale: 2,
});

loadRoot("/pub/examples/");

loadSprite("car", "img/car.png", {
	sliceX: 3,
});

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
// 	drawTri(vec2(100, 100), vec2(200, 200), mousePos(), {
// 		color: rgb(1, 1, 1)
// 	});
});
