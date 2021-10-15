// kaboom as pure rendering lib (no component / game obj etc.)

kaboom();

loadSprite("bean", "sprites/bean.png");

const t = (n = 1) => time() * n;
const p = (x, y) => vec2(x, y).scale(200).add(120, 120);
const trail = [];

const outline = {
	width: 4,
	color: rgb(0, 0, 255),
};

render(() => {

	drawSprite({
		sprite: "bean",
		pos: p(0, 0),
		angle: t(40),
		origin: "center",
		scale: wave(1, 1.5, t(4)),
		color: rgb(wave(128, 255, t(4)), wave(128, 255, t(8)), 255),
	});

	drawRect({
		pos: p(1, 0),
		width: wave(60, 120, t(4)),
		height: wave(100, 140, t(8)),
		origin: "center",
		radius: wave(0, 24, t(8)),
		angle: t(80),
		color: rgb(wave(128, 255, t(4)), 255, wave(128, 255, t(8))),
		outline,
	});

	drawEllipse({
		pos: p(2, 0),
		radiusX: wave(40, 60, t(4)),
		radiusY: wave(40, 60, t(8)),
		color: rgb(255, wave(128, 255, t(8)), wave(128, 255, t(4))),
		outline,
	});

	trail.push(mousePos());

	if (trail.length > 16) {
		trail.shift();
	}

	drawLines({
		pts: trail,
		...outline,
	});

});
