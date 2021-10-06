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

	const l1 = {
		p1: vec2(0),
		p2: mousePos(),
	};

	const l2 = {
		p1: vec2(100, 300),
		p2: vec2(300, 100),
	};

	drawLine(l1.p1, l1.p2, {
		width: 3,
		color: rgb(0, 0, 255),
	});

	drawLine(l2.p1, l2.p2, {
		width: 3,
		color: rgb(0, 0, 255),
	});

	const pt = colLineLine(l1, l2);

	if (pt) {
		drawRect(pt, 12, 12, {
			origin: "center",
		});
	}

	drawText("hi", {
		pos: mousePos(),
		size: 64,
	});
// 	drawTri(vec2(100, 100), vec2(200, 200), mousePos(), {
// 		color: rgb(1, 1, 1)
// 	});
});
