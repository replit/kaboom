// kaboom as pure rendering lib (no component / game obj etc.)

kaboom();

loadSprite("bean", "sprites/bean.png");

render(() => {
	drawSprite("bean", {
		pos: vec2(120),
		rot: time() * 100,
		origin: "center",
	});
	drawRect(vec2(50), 40, 100);
	drawLine(vec2(0), mousePos(), {
		width: 3,
		color: rgb(0, 0, 1),
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
