kaboom.import();

init();

scene("main", () => {
	const SPEED = 320;
	gravity(1600);
	const player = add([
		rect(32, 64),
		pos(100, 100),
		body(),
	]);
	keyPress("space", () => {
		if (player.grounded()) {
			player.jump(540);
		}
	});
	keyDown("left", () => {
		player.move(-SPEED, 0);
	});
	keyDown("right", () => {
		player.move(SPEED, 0);
	});
	add([
		rect(width(), 6),
		pos(0, 400),
		solid(),
		origin("topleft"),
	]);
	add([
		rect(120, 6),
		pos(240, 320),
		solid(),
	]);
	add([
		rect(32, 32),
		pos(160, 360),
		solid(),
	]);
	keyPress("F1", () => {
		kaboom.debug.showArea = !kaboom.debug.showArea;
		kaboom.debug.showInfo = !kaboom.debug.showInfo;
	});
});

start("main");

