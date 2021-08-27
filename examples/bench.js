// bench marking sprite rendering performance

const k = kaboom({
	scale: 2,
});

k.loadRoot("/pub/examples/");
k.loadSprite("mark", "img/mark.png");

k.render(() => {

	const w = k.width();
	const h = k.height();

	for (let i = 0; i < 3000; i++) {
		k.drawSprite("mark", {
			pos: k.vec2(k.rand(0, w), k.rand(0, h)),
			origin: "center",
		});
	}

	k.drawText(k.debug.fps().toFixed(0), {
		pos: k.vec2(w / 2, h / 2),
		origin: "center",
		size: 36,
		color: k.rgb(1, 0.4, 1),
	});

});
