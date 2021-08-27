// simple UI

kaboom({
	fullscreen: true,
	scale: 2,
});

function addButton(txt, p, f) {

	const bg = add([
		pos(p),
		rect(60, 30),
		area(),
		origin("center"),
		color(1, 1, 1),
	]);

	add([
		text(txt, 8),
		pos(p),
		origin("center"),
		color(0, 0, 0),
	]);

	bg.action(() => {
		if (bg.isHovered()) {
			bg.color = rgb(0.8, 0.8, 0.8);
			if (mouseIsClicked()) {
				f();
			}
		} else {
			bg.color = rgb(1, 1, 1);
		}
	});

}

addButton("start", vec2(100, 100), () => debug.log("oh hi"));
addButton("quit", vec2(100, 150), () => debug.log("bye"));
