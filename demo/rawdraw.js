// kaboom as pure rendering lib (no component / game obj etc.)

kaboom();

loadSprite("bean", "sprites/bean.png");

render(() => {

	drawSprite({
		sprite: "bean",
		pos: vec2(120),
		angle: time() * 100,
		origin: "center",
	});

	pushTransform();
	pushTranslate(vec2(20, 300));
// 	pushRotate(time() * 100);
	pushScale(vec2(3));

	drawRect({
		width: 40,
		height: 80,
// 		origin: "center",
// 		radius: 10,
		outline: {
			width: 2,
			color: rgb(0, 0, 255),
		},
	});

	popTransform();

	const l1 = {
		p1: vec2(0),
		p2: mousePos(),
	};

	const l2 = {
		p1: vec2(100, 300),
		p2: vec2(300, 100),
	};

	drawLine({
		p1: l1.p1,
		p2: l1.p2,
		width: 3,
		color: rgb(0, 0, 255),
	});

	drawLine({
		p1: l2.p1,
		p2: l2.p2,
		width: 3,
		color: rgb(0, 0, 255),
	});

	const pt = testLineLine(l1, l2);

	if (pt) {
		drawCircle({
			pos: pt,
			radius: 12,
			origin: "center",
			color: rgb(255, 255, 0),
		});
	}

	drawText({
		text: "Drawcalls: " + debug.drawCalls(),
		pos: vec2(24, 24),
		size: 64,
	});

	drawTri({
		p1: vec2(480, 120),
		p2: vec2(200, 240),
		p3: mousePos(),
		color: rgb(128, 128, 255),
		outline: {
			width: 4,
			color: rgb(0, 0, 255),
		},
	});

	drawRect({
		width: 100,
		height: 240,
		pos: vec2(400),
		origin: "center",
		fill: false,
		outline: {
			width: 4,
			color: rgb(0, 0, 255),
		},
	});

	// TODO: this outline looks awful
	drawEllipse({
		radiusX: 50,
		radiusY: 120,
		pos: vec2(400),
		outline: {
			width: 4,
			color: rgb(0, 0, 255),
		},
	});

});
