// simple UI

kaboom();

function addButton(txt, p, f) {

	const btn = add([
		text(txt, 8),
		pos(p),
		area({ cursor: "pointer", }),
		scale(1),
		origin("center"),
	]);

	btn.clicks(f);

	btn.hovers(() => {
		const t = time() * 10;
		btn.color = rgb(
			wave(0, 255, t),
			wave(0, 255, t + 2),
			wave(0, 255, t + 4),
		);
		btn.scale = vec2(1.2);
	}, () => {
		btn.scale = vec2(1);
		btn.color = rgb();
	});

}

addButton("Start", vec2(200, 100), () => debug.log("oh hi"));
addButton("Quit", vec2(200, 200), () => debug.log("bye"));

// reset cursor to default at frame start for easier cursor management
action(() => cursor("default"));
