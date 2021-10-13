// kaboom as pure rendering lib (no component / game obj etc.)

kaboom();

loadSprite("bean", "sprites/bean.png");

render(() => {

	drawSprite("bean", {
		pos: vec2(120),
		angle: time() * 100,
		origin: "center",
	});

	pushTransform();
	pushTranslate(vec2(20, 300));
// 	pushRotate(time() * 100);
	pushScale(vec2(3));

	drawRect(vec2(0), 40, 80, {
		origin: "center",
		radius: 10,
		stroke: {
			width: 4,
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

	drawLine(l1.p1, l1.p2, {
		width: 3,
		color: rgb(0, 0, 255),
	});

	drawLine(l2.p1, l2.p2, {
		width: 3,
		color: rgb(0, 0, 255),
	});

	const pt = testLineLine(l1, l2);

	if (pt) {
		drawCircle(pt, 24, {
			origin: "center",
			color: rgb(255, 255, 0),
		});
	}

	drawText("hi", {
		pos: mousePos(),
		size: 64,
	});

	drawTri(vec2(480, 120), vec2(200, 240), mousePos(), {
		color: rgb(128, 128, 255)
	});

});
