kaboom.global();

init({
	fullscreen: true,
	scale: 2,
});

scene("main", () => {

	const p2 = add([
		pos(100, 100),
		rect(24, 24),
		solid(),
	]);

	const p1 = add([
		pos(0, 0),
		rect(24, 24),
		solid(),
	]);

	const SPEED = 240;

	keyDown("w", () => {
		p1.move(0, -SPEED);
		p1.resolve();
	});

	keyDown("s", () => {
		p1.move(0, SPEED);
		p1.resolve();
	});

	keyDown("a", () => {
		p1.move(-SPEED, 0);
		p1.resolve();
	});

	keyDown("d", () => {
		p1.move(SPEED, 0);
		p1.resolve();
	});

	keyDown("up", () => {
		p2.move(0, -SPEED);
		p2.resolve();
	});

	keyDown("down", () => {
		p2.move(0, SPEED);
		p2.resolve();
	});

	keyDown("left", () => {
		p2.move(-SPEED, 0);
		p2.resolve();
	});

	keyDown("right", () => {
		p2.move(SPEED, 0);
		p2.resolve();
	});

	keyPress("f1", () => {
		kaboom.debug.showArea = !kaboom.debug.showArea;
		kaboom.debug.hoverInfo = !kaboom.debug.hoverInfo;
	});
});

start("main");
