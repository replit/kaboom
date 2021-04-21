kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

scene("main", () => {

	function addButton(txt, p, f) {

		const bg = add([
			pos(p),
			rect(60, 30),
			origin("center"),
			color(1, 1, 1),
		]);

		add([
			text(txt),
			pos(p),
			rect(100, 100),
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

	addButton("start", vec2(100, 100), () => {
		alert("oh hi");
	});

	addButton("quit", vec2(100, 150), () => {
		alert("bye");
	});

});

start("main");
