kaboom.import();

init({
	width: 240,
	height: 240,
	scale: 2,
});

scene("main", () => {

	const SIZE = 9;
	const SPEED = 120;

	const map = addMap([
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

	], {
		width: SIZE,
		height: SIZE,
		pos: vec2(SIZE / 2),
		"0": [
			rect(1, 1),
			"candy",
		],
		"1": [
			rect(SIZE, SIZE),
			solid(),
		],
	});

	const player = add([
		pos(map.getPos(1, 1)),
		rect(SIZE, SIZE),
		color(1, 1, 0),
// 		{
// 			dir: undefined,
// 		},
	]);

	const velMap = {
		"left": vec2(-1, 0),
		"right": vec2(1, 0),
		"up": vec2(0, -1),
		"down": vec2(0, 1),
	};

	player.action(() => {
		console.log(fps());
// 		if (player.dir) {
// 			player.move(velMap[player.dir].scale(SPEED));
// 		}
		player.resolve();
	});

	player.collides("candy", (c) => {
		destroy(c);
		score.value++;
		score.text = score.value;
	});

// 	for (const dir of ["left", "right", "up", "down"]) {
// 		keyPress(dir, () => {
// 			player.dir = dir;
// 		});
// 	}

	for (const dir of ["left", "right", "up", "down"]) {
		keyDown(dir, () => {
			player.move(velMap[dir].scale(SPEED));
		});
	}

	const score = add([
		text("0"),
		color(0, 0, 0),
		origin("topleft"),
		{
			value: 0,
		},
	]);

});

start("main");

