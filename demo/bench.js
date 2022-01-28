// bench marking sprite rendering performance

kaboom();

loadBean();

onDraw(() => {

	const w = width();
	const h = height();

	for (let i = 0; i < 5000; i++) {
		drawSprite({
			sprite: "bean",
			pos: vec2(rand(0, w), rand(0, h)),
			origin: "center",
		});
	}

	drawText({
		text: debug.fps(),
		pos: vec2(w / 2, h / 2),
		origin: "center",
		color: rgb(255, 127, 255),
	});

});
