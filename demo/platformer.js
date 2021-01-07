kaboom.import();

init();
loadSprite("guy", "guy.png");

scene("main", () => {

	initWorld({
		gravity: 9.8 * 120,
	});

// 	initLevel([
// 		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
// 		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
// 		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
// 		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
// 		0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
// 		0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0,
// 		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
// 	], {
// 		"1": () => {
// 			return sprite("block", {
// 				solid: true,
// 			});
// 		},
// 		"2": () => {
// 			return sprite("enemy");
// 		},
// 	});

	const player = add([
		sprite("guy"),
		pos(0, 0),
		jumper(560),
	]);

	keyPress("up", () => {
		player.jump();
	});

	keyDown("left", () => {
		player.move(vec2(-320, 0));
	});

	keyDown("right", () => {
		player.move(vec2(320, 0));
	});

	add([
		rect(width(), 4),
		pos(0, -120),
		{
			solid: true,
		},
	]);

	add([
		rect(128, 4),
		pos(-120, 0),
		{
			solid: true,
		},
	]);

	add([
		rect(128, 4),
		pos(120, 0),
		{
			solid: true,
		},
	]);

	add([
		rect(32, 32),
		pos(120, -80),
		{
			solid: true,
		},
	]);

	keyPress("F1", () => {
		kaboom.debug.showArea = !kaboom.debug.showArea;
	});

	keyPress("F2", () => {
		kaboom.debug.showInfo = !kaboom.debug.showInfo;
	});

});

start("main");

