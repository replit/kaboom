kaboom.import();
init();
loadSprite("guy", "guy.png");

scene("main", () => {

	const player = add([
		sprite("guy"),
		pos(0, 0),
		"player",
		{
			speed: 240,
			dir: "up",
		},
	]);

	const enemy = add([
		sprite("guy"),
		pos(60, 0),
		color(0, 0, 1, 1),
		"enemy",
	]);

	const score = add([
		text("0", 256),
		color(1, 1, 1, 0.03),
		scal(1),
		"shrink",
		{
			value: 0,
		},
	]);

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
			player.pos = player.pos.add(velMap[dir].scale(player.speed * dt()));
			player.dir = dir;
		});
	}

	keyPress(" ", () => {
		addScore();
	});

});

start("main");
