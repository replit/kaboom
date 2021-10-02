// bench marking sprite rendering performance

kaboom();

loadBean();

render(() => {

	const w = width();
	const h = height();

	for (let i = 0; i < 3000; i++) {
		drawSprite("bean", {
			pos: vec2(rand(0, w), rand(0, h)),
			origin: "center",
		});
	}

	drawText(debug.fps().toFixed(0), {
		pos: vec2(w / 2, h / 2),
		origin: "center",
		color: rgb(255, 127, 255),
	});

});
