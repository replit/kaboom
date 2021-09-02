// kaboom as pure rendering lib (no component / game obj etc.)

kaboom();

loadSprite("car", "sprites/car.png");

render(() => {
	drawSprite("car", {
		pos: vec2(120),
		rot: time(),
		origin: "center",
	});
	drawRect(vec2(50), 40, 100);
	drawLine(vec2(0), mousePos(), {
		width: 3,
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
