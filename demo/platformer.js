kaboom.import();

init();
loadSprite("guy", "guy.png");

scene("main", () => {

	initWorld({
		gravity: 9.8,
		acc: 120,
	});

	initLevel([
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	], {
		"1": () => {
			return sprite("block", {
				solid: true,
			});
		},
		"2": () => {
			return sprite("enemy");
		},
	});

	const player = addPlayer({
		pos: vec2(0, 320),
		jumpForce: 560,
	});

	keyPress("up", () => {
		player.jump();
	});

	keyDown("left", () => {
		player.move(vec2(-320, 0));
	});

	keyDown("right", () => {
		player.move(vec2(320, 0));
	});

	rect(width(), 4, {
		pos: vec2(0, -120),
		solid: true,
	});

	rect(128, 4, {
		pos: vec2(-120, 0),
		solid: true,
	});

	rect(128, 4, {
		pos: vec2(120, 0),
		solid: true,
	});

	rect(32, 32, {
		pos: vec2(120, -80),
		solid: true,
	});

});

start("main");

