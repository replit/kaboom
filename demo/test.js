kaboom.import();
init();
loadSprite("guy", "guy.png");

scene("main", () => {

	layers([
		"background",
		"field",
	]);

	const player = add([
		sprite("guy"),
		pos(0, 0),
		layer("field"),
		"player",
		{
			speed: 240,
			dir: "up",
		},
	]);

	const enemy = add([
		sprite("guy"),
		pos(120),
		layer("field"),
		color(0, 0, 1, 1),
		"enemy",
		"bad",
	]);

	const score = add([
		text("0", 256),
		color(1, 1, 1, 0.03),
		scale(1),
		layer("background"),
		"shrink",
		{
			value: 0,
		},
	]);

	player.onCollide("enemy", () => {
		// TODO
	});

	keyPress("F1", () => {
		kaboom.debug.showArea = !kaboom.debug.showArea;
	});

	keyPress("F2", () => {
		kaboom.debug.showInfo = !kaboom.debug.showInfo;
	});

	onUpdate("shrink", (o) => {
		o.scale = lerp(o.scale, 1, 2);
	});

	function addScore() {
		score.value++;
		score.text = `${score.value}`;
		score.scale = score.scale * 1.2;
	}

	const velMap = {
		left: vec2(-1, 0),
		right: vec2(1, 0),
		up: vec2(0, 1),
		down: vec2(0, -1),
	};

	for (const dir of [ "left", "right", "up", "down", ]) {
		keyDown(dir, () => {
			player.move(velMap[dir].scale(player.speed));
			player.dir = dir;
		});
	}

});

start("main");

