// simple UI

kaboom();

function addButton(txt, p, f) {

	const btn = add([
		text(txt, 8),
		pos(p),
		area(),
		scale(1),
		origin("center"),
	]);

	btn.action(() => {
		if (btn.isHovered()) {
			const t = time() * 10;
			btn.color = rgb(
				wave(0, 255, t),
				wave(0, 255, t + 2),
				wave(0, 255, t + 4),
			);
			btn.scale = vec2(1.2);
			cursor("pointer");
			if (mouseIsClicked()) {
				f();
			}
		} else {
			btn.scale = vec2(1);
			btn.color = rgb();
		}
	});

}

addButton("start", vec2(200, 100), () => debug.log("oh hi"));
addButton("quit", vec2(200, 200), () => debug.log("bye"));
